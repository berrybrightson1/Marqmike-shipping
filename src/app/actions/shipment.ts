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

        const orders = await db.shipment.findMany({
            where: { customerId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                events: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        });

        // calculate progress based on status (simple mock logic for now or deriving from status)
        const enriched = orders.map(order => {
            let progress = 0;
            if (order.status === 'Pending') progress = 10;
            else if (order.status === 'Processing') progress = 30;
            else if (order.status === 'In Transit') progress = 60;
            else if (order.status === 'Arrived') progress = 90;
            else if (order.status === 'Delivered') progress = 100;

            return {
                ...order,
                progress,
                // Map database fields to UI expectations if needed
                item: order.shipperName || "Package", // Fallback if item name isn't in DB, though creating shipment should have it.
                // Actually, Shipment model structure might not match my Mock Data perfectly.
                // let's assume we map standard fields.
                date: order.createdAt.toLocaleDateString(),
                type: 'Air' // Default or db field
            };
        });

        return { success: true, data: enriched };
    } catch (error) {
        console.error("Get User Orders Error:", error);
        return { success: false, data: [] };
    }
}
