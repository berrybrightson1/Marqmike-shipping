"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { logAuditAction } from "./audit";

export async function getDashboardData() {
    try {
        const user = await getCurrentUser();

        if (!user) return { shipments: [] };

        // Build where clause based on role
        const where: any = user.role === "ADMIN"
            ? {}
            : { customerId: user.id };

        const shipments = await db.shipment.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                events: true,
                customer: {
                    select: { name: true, phone: true }
                }
            },
            take: 5
        });
        return { shipments };
    } catch (error) {
        console.error("Database Error:", error);
        return { shipments: [] };
    }
}

export async function createShipment(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        trackingId: formData.get('trackingId') as string,
        shipperName: formData.get('shipperName') as string,
        recipientName: formData.get('recipientName') as string,
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        status: "Pending",
        customerId: user.id
    }

    if (!rawData.trackingId || !rawData.shipperName) {
        return { error: "Missing required fields" };
    }

    try {
        const shipment = await db.shipment.create({
            data: rawData
        });

        await logAuditAction(
            "SHIPMENT_CREATED",
            "SHIPMENT",
            `Shipment Created: ${rawData.trackingId}`,
            shipment.id,
            { origin: rawData.origin, destination: rawData.destination },
            user.name || "Admin"
        );
    } catch (error) {
        console.error("Create Shipment Error:", error);
        return { error: "Failed to create shipment. Tracking ID might be duplicate." };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function getShipment(trackingId: string) {
    try {
        const shipment = await db.shipment.findUnique({
            where: { trackingId },
            include: { events: { orderBy: { timestamp: 'desc' } } }
        });
        return shipment;
    } catch (error) {
        console.error("Get Shipment Error:", error);
        return null;
    }
}

export async function getAllShipments() {
    try {
        const shipments = await db.shipment.findMany({
            orderBy: { createdAt: 'desc' }, // Assuming createdAt exists, if not we'll use id
            include: { events: true }
        });
        return { success: true, data: shipments };
    } catch (error) {
        console.error("Get All Shipments Error:", error);
        return { success: false, data: [] };
    }
}

export async function updateShipmentStatus(trackingId: string, newStatus: string, location?: string) {
    try {
        // 1. Update Shipment Status
        const shipment = await db.shipment.update({
            where: { trackingId },
            data: { status: newStatus }
        });

        // 2. Create Event Log
        await db.shipmentEvent.create({
            data: {
                shipmentId: shipment.id,
                status: newStatus,
                location: location || "Processing Center",
                timestamp: new Date()
            }
        });

        // 3. Create Audit Log
        await logAuditAction(
            "SHIPMENT_STATUS_UPDATE",
            "SHIPMENT",
            `Shipment ${trackingId} updated to ${newStatus}`,
            shipment.id,
            { newStatus, location },
            "Admin" // Since this is an admin action
        );

        // 4. Send User Notification
        if (shipment.customerId) {
            // Import dynamically to avoid circular dependency issues if any, though here it's fine
            const { sendSystemNotification } = await import("./notification");
            await sendSystemNotification(
                shipment.customerId,
                `Shipment Update: ${trackingId}`,
                `Your shipment is now ${newStatus}. Current Location: ${location || 'In Transit'}`
            );
        }

        revalidatePath('/admin/shipments');
        revalidatePath(`/track/${trackingId}`);
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Failed to update status" };
    }
}
// ... existing code ...

export async function getUserOrders() {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, data: [] };

        // 1. Fetch Shipments (Tracking Active)
        const shipments = await db.shipment.findMany({
            where: { customerId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                events: { orderBy: { timestamp: 'desc' }, take: 1 }
            }
        });

        // 2. Fetch Shop Orders (Purchases)
        const shopOrders = await db.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: { items: true }
        });

        // 3. Fetch Procurement Requests (Buy For Me)
        const procurementRequests = await db.procurementRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        // --- Normalization & Merging ---

        // Map Shipments
        const normalizedShipments = shipments.map(s => {
            let progress = 10;
            if (s.status === 'Processing') progress = 30;
            if (s.status === 'In Transit') progress = 60;
            if (s.status === 'Arrived') progress = 90;
            if (s.status === 'Delivered') progress = 100;

            return {
                id: s.id,
                trackingId: s.trackingId,
                ref: s.trackingId,
                item: s.shipperName || "Package", // Often contains "Order Items..."
                status: s.status,
                progress,
                date: s.createdAt.toLocaleDateString(),
                type: 'Shipment',
                origin: s.origin,
                destination: s.destination,
                rawDate: s.createdAt
            };
        });

        // Map Shop Orders
        // *IMPORTANT*: Exclude orders that already have a Shipment (via trackingId) to avoid duplicates.
        const shipmentTrackingIds = new Set(shipments.map(s => s.trackingId));

        const normalizedOrders = shopOrders
            .filter(o => !o.trackingId || !shipmentTrackingIds.has(o.trackingId))
            .map(o => {
                const mainItem = o.items[0]?.itemName || "General Goods";
                const otherCount = o.items.length - 1;
                const itemLabel = otherCount > 0 ? `${mainItem} + ${otherCount} others` : mainItem;

                let progress = 10;
                if (o.status === 'Processing') progress = 30;
                if (o.status === 'Completed') progress = 100;

                return {
                    id: o.id,
                    trackingId: o.trackingId || "Pending",
                    ref: o.refCode,
                    item: itemLabel,
                    status: o.status,
                    progress,
                    date: o.createdAt.toLocaleDateString(),
                    type: 'Shop Order',
                    origin: 'Marqmike Shop',
                    destination: 'Ghana',
                    rawDate: o.createdAt
                };
            });

        // Map Procurements
        const normalizedProcurements = procurementRequests.map(p => {
            let progress = 10;
            if (p.status === 'Approved') progress = 30;
            if (p.status === 'Purchased') progress = 60;
            if (p.status === 'Shipped') progress = 80; // Usually moves to shipment then
            if (p.status === 'Completed') progress = 100;

            return {
                id: p.id,
                trackingId: "REQ-" + p.id.slice(-6).toUpperCase(),
                ref: "Procurement",
                item: p.itemName,
                status: p.status,
                progress,
                date: p.createdAt.toLocaleDateString(),
                type: 'Procurement',
                origin: 'Request',
                destination: 'Review',
                rawDate: p.createdAt
            }
        });

        // Combine and Sort by Date
        const allItems = [...normalizedShipments, ...normalizedOrders, ...normalizedProcurements]
            .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        return { success: true, data: allItems };

    } catch (error) {
        console.error("Get User Orders Error:", error);
        return { success: false, data: [] };
    }
}
