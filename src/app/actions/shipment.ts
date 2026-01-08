"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getDashboardData() {
    try {
        const shipments = await db.shipment.findMany({
            orderBy: {
                id: 'desc'
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
    const rawData = {
        trackingId: formData.get('trackingId') as string,
        shipperName: formData.get('shipperName') as string,
        recipientName: formData.get('recipientName') as string,
        origin: formData.get('origin') as string,
        destination: formData.get('destination') as string,
        status: "Pending"
    }

    if (!rawData.trackingId || !rawData.shipperName) {
        return { error: "Missing required fields" };
    }

    try {
        await db.shipment.create({
            data: rawData
        });
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
// ... existing actions ...

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

import { logAuditAction } from "./audit";

// ... existing code ...

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
            "Update Status",
            `Shipment ${trackingId} updated to ${newStatus}`
        );

        revalidatePath('/admin/shipments');
        revalidatePath(`/track/${trackingId}`);
        return { success: true };
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Failed to update status" };
    }
}
