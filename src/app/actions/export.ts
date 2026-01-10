"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./auth";

export async function exportData(type: 'orders' | 'shipments') {
    const user = await getCurrentUser();

    // In a real app, restrict to ADMIN only
    // if (!user || user.role !== 'ADMIN') return { error: "Unauthorized" };

    try {
        if (type === 'orders') {
            const orders = await db.order.findMany({
                orderBy: { createdAt: 'desc' },
                include: { items: true } // Fetch items to list simple details
            });

            // Headers
            let csv = "Order ID,Reference,Customer Name,Phone,Status,Total Amount,Date\n";

            // Rows
            orders.forEach(order => {
                const date = order.createdAt.toISOString().split('T')[0];
                const sanitizedName = order.customerName.replace(/,/g, ' '); // Simple CSV escape
                // const itemsSummary = order.items.map(i => `${i.quantity}x ${i.itemName}`).join('; ');

                csv += `${order.id},${order.refCode},${sanitizedName},${order.customerPhone},${order.status},${order.totalAmount},${date}\n`;
            });

            return { success: true, csv, filename: `orders_export_${new Date().toISOString().slice(0, 10)}.csv` };

        } else if (type === 'shipments') {
            const shipments = await db.shipment.findMany({
                orderBy: { createdAt: 'desc' }
            });

            let csv = "Tracking ID,Shipper,Recipient,Origin,Destination,Status,Date\n";

            shipments.forEach(s => {
                const date = s.createdAt.toISOString().split('T')[0];
                csv += `${s.trackingId},${s.shipperName},${s.recipientName},${s.origin},${s.destination},${s.status},${date}\n`;
            });

            return { success: true, csv, filename: `shipments_export_${new Date().toISOString().slice(0, 10)}.csv` };
        }

        return { error: "Invalid type" };
    } catch (error) {
        console.error("Export Error:", error);
        return { error: "Failed to generate export" };
    }
}
