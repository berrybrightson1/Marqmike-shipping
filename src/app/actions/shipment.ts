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

    const customerPhone = formData.get('customerPhone') as string;

    const rawData = {
        trackingId: formData.get('trackingId') as string,
        shipperName: formData.get('shipperName') as string,
        recipientName: formData.get('recipientName') as string,
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        status: "Pending",
        customerId: user.id // Default to admin if no phone
    }

    if (!rawData.trackingId || !rawData.shipperName) {
        return { error: "Missing required fields" };
    }

    // Link to Customer if Phone Provided
    if (customerPhone) {
        // Find user by phone
        // Remove spaces or format if needed, but assuming exact match for now
        const customer = await db.user.findFirst({
            where: { phone: { contains: customerPhone.replace('+', '') } } // Loose match
        });

        if (customer) {
            rawData.customerId = customer.id;
        } else {
            return { error: "Customer not found with this phone number" };
        }
    } else {
        // If meant for a customer, phone is required.
        // If manual shipment without user account, leave as Admin ID?
        // Let's enforce phone for visibility.
        return { error: "Customer Phone is required to link shipment" };
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

        // 1. Fetch Shipments (The "In Transit" containers)
        const shipments = await db.shipment.findMany({
            where: { customerId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                events: { orderBy: { timestamp: 'desc' }, take: 1 },
                orders: true, // Includes items inside
                procurementRequests: true
            } as any // Temporary cast to bypass stale TS types
        });

        // 2. Fetch Shop Orders (Loose Items)
        const shopOrders = await db.order.findMany({
            where: { userId: user.id, shipmentId: null } as any, // Only those NOT in a shipment
            orderBy: { createdAt: 'desc' },
            include: { items: true }
        });

        // 3. Fetch Procurement Requests (Loose Items)
        const procurementRequests = await db.procurementRequest.findMany({
            where: { userId: user.id, shipmentId: null } as any, // Only those NOT in a shipment
            orderBy: { createdAt: 'desc' }
        });

        // --- Normalization ---

        // A. Shipments (Tab: 'shipment')
        const normalizedShipments = shipments.map(s => {
            let progress = 10;
            if (s.status === 'Processing') progress = 30;
            if (s.status === 'In Transit') progress = 60;
            if (s.status === 'Arrived') progress = 90;
            if (s.status === 'Delivered') progress = 100;

            const itemCount = s.orders.length + s.procurementRequests.length;

            return {
                id: s.id,
                trackingId: s.trackingId,
                ref: s.trackingId,
                item: s.shipperName || `${itemCount} Items Consolidated`,
                status: s.status,
                progress,
                date: s.createdAt.toLocaleDateString(),
                type: 'Shipment',
                origin: s.origin,
                destination: s.destination,
                rawDate: s.createdAt.toISOString(),
                tab: 'shipment',
                items: [...s.orders, ...s.procurementRequests] // useful for details
            };
        });

        // B. Shop Orders (Tab: 'request' or 'warehouse')
        const normalizedOrders = shopOrders.map(o => {
            const mainItem = o.items[0]?.itemName || "General Goods";
            const otherCount = o.items.length - 1;
            const itemLabel = otherCount > 0 ? `${mainItem} + ${otherCount} others` : mainItem;

            // "Arrived" means it's in the Virtual Warehouse
            const isWarehouse = o.status === 'Arrived';

            return {
                id: o.id,
                trackingId: o.trackingId || "Pending",
                ref: o.refCode,
                item: itemLabel,
                status: o.status,
                progress: isWarehouse ? 100 : 30,
                date: o.createdAt.toLocaleDateString(),
                type: 'Shop',
                origin: 'Marqmike Shop',
                destination: 'Warehouse',
                rawDate: o.createdAt.toISOString(),
                tab: isWarehouse ? 'warehouse' : 'request',
                price: o.totalAmount
            };
        });

        // C. Procurements (Tab: 'request' or 'warehouse')
        const normalizedProcurements = procurementRequests.map(p => {
            // "Arrived" means it's in the Virtual Warehouse
            const isWarehouse = p.status === 'Arrived';

            return {
                id: p.id,
                trackingId: "REQ-" + p.id.slice(-6).toUpperCase(),
                ref: "Procurement",
                item: p.itemName,
                status: p.status,
                progress: isWarehouse ? 100 : 30,
                date: p.createdAt.toLocaleDateString(),
                type: 'Procurement',
                origin: 'External Link',
                destination: 'Warehouse',
                rawDate: p.createdAt.toISOString(),
                tab: isWarehouse ? 'warehouse' : 'request',
                price: 0 // usually unknown until quoted
            }
        });

        // Combine and Sort
        const allItems = [...normalizedShipments, ...normalizedOrders, ...normalizedProcurements]
            .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        return { success: true, data: allItems };

    } catch (error) {
        console.error("Get User Orders Error:", error);
        return { success: false, data: [] };
    }
}

// --- Create Consolidated Shipment (Virtual Warehouse -> Shipment) ---
export async function createConsolidatedShipment(selectedItems: { id: string, type: 'Shop' | 'Procurement' }[]) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!selectedItems || selectedItems.length === 0) {
        return { success: false, error: "No items selected" };
    }

    try {
        const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

        // 1. Create Shipment
        const shipment = await db.shipment.create({
            data: {
                trackingId,
                customerId: user.id,
                status: "Processing", // Valid initial status
                shipperName: `Consolidated Shipment (${selectedItems.length} items)`,
                recipientName: user.name || "Customer",
                origin: "Guangzhou Warehouse",
                destination: "Ghana"
            }
        });

        // 2. Link Items to Shipment
        // We have to loop or use Promise.all because they are different tables
        await Promise.all(selectedItems.map(async (item) => {
            if (item.type === 'Shop') {
                await db.order.update({
                    where: { id: item.id },
                    data: { shipmentId: shipment.id, status: "Shipped" } as any // Move status forward
                });
            } else {
                await db.procurementRequest.update({
                    where: { id: item.id },
                    data: { shipmentId: shipment.id, status: "Shipped" } as any
                });
            }
        }));

        // 3. Log Audit
        await logAuditAction(
            "SHIPMENT_CREATED",
            "SHIPMENT",
            `Consolidated Shipment ${trackingId} created with ${selectedItems.length} items`,
            shipment.id,
            { itemCount: selectedItems.length },
            user.name || "Customer"
        );

        revalidatePath('/dashboard/shipments');
        return { success: true, trackingId };

    } catch (error) {
        console.error("Create Consolidated Shipment Error:", error);
        return { success: false, error: "Failed to create shipment" };
    }
}
