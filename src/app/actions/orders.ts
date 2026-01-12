"use server";

import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/app/actions/audit";

// --- Create Order (Called before WhatsApp Redirect) ---
export async function createOrder(data: {
    customerName: string;
    customerPhone: string;
    items: any[]; // Cart items
}) {
    const user = await getCurrentUser();

    // Generate a unique reference code
    const refCode = `REF-${Math.floor(1000 + Math.random() * 9000)}-MQM`;

    // Calculate Total Amount
    const totalAmount = data.items.reduce((sum, item) => {
        return sum + ((item.priceAtTime || 0) * (item.quantity || 1));
    }, 0);

    try {
        // Capture order result from transaction
        const orderId = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const order = await tx.order.create({
                data: {
                    userId: user?.id,
                    refCode: refCode,
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    status: "Pending",
                    totalAmount: totalAmount,
                    items: {
                        create: data.items.map((item: any) => ({
                            itemName: item.name || item.itemName || "Unknown Item",
                            quantity: item.qty || item.quantity || 1,
                            priceAtTime: item.priceAtTime || 0,
                            itemUrl: item.url || item.itemUrl || null,
                            productId: item.productId || null
                        }))
                    }
                }
            });

            // 2. Decrement Stock for Inventory Items
            for (const item of data.items) {
                if (item.productId) {
                    try {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity || 1 } }
                        });
                    } catch (e) {
                        console.warn(`Failed to update stock for ${item.productId}`);
                    }
                }
            }

            return order.id;
        });

        // 3. Log Audit Action
        await logAuditAction(
            "ORDER_CREATED",
            "ORDER",
            `Order ${refCode} placed by ${data.customerName}`,
            orderId,
            { customerPhone: data.customerPhone, totalAmount, itemCount: data.items.length },
            data.customerName
        );

        // Revalidate admin views
        revalidatePath("/admin/orders");
        revalidatePath("/admin/inventory"); // Update stock view

        return { success: true, refCode };
    } catch (error) {
        console.error("Create Order Error:", error);
        return { success: false, error: "Failed to save order" };
    }
}

// --- Admin: Get All Orders ---
export async function getAdminOrders() {
    const { unstable_noStore: noStore } = require('next/cache');
    noStore();

    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        const [orders, procurements] = await Promise.all([
            prisma.order.findMany({
                include: {
                    items: true,
                    user: { select: { name: true, email: true } }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.procurementRequest.findMany({
                include: {
                    user: { select: { name: true, phone: true } } // Fetch user details for procurement
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Normalize Orders
        const normalizedOrders = orders.map(o => ({
            id: o.id,
            type: 'Shop',
            refCode: o.refCode,
            customerName: o.customerName || o.user?.name || "Unknown",
            customerPhone: o.customerPhone,
            items: o.items,
            totalAmount: o.totalAmount,
            trackingId: o.trackingId,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            rawDate: o.createdAt
        }));

        // Normalize Procurements
        const normalizedProcurements = procurements.map(p => ({
            id: p.id,
            type: 'Procurement',
            refCode: "REQ-" + p.id.slice(-6).toUpperCase(),
            customerName: p.user?.name || "Unknown",
            customerPhone: p.user?.phone || "Unknown",
            items: [{ itemName: p.itemName, quantity: 1, itemUrl: p.itemUrl }], // Mock single item list
            totalAmount: 0, // Procurements often don't have price yet until paid
            trackingId: null, // Usually handled via status
            status: p.status,
            createdAt: p.createdAt.toISOString(),
            rawDate: p.createdAt,
            notes: p.notes
        }));

        const unified = [...normalizedOrders, ...normalizedProcurements]
            .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

        return { success: true, data: unified };
    } catch (error) {
        console.error("Get Admin Orders Error:", error);
        return { success: false, error: "Failed to fetch orders" };
    }
}

// --- Notify & Sync Order (Bell Icon Action) ---
export async function notifyAndSyncOrder(orderId: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order || !order.trackingId) {
            return { success: false, error: "Order or tracking ID missing" };
        }

        // 1. Ensure Shipment Exists
        await syncToShipment(order);

        // 2. Notify User
        if (order.userId) {
            const { sendSystemNotification } = await import("./notification");
            await sendSystemNotification(
                order.userId,
                `Order Processed: ${order.refCode}`,
                `Your order has been processed. Tracking ID: ${order.trackingId}. You can now view it in your Orders page.`
            );
        }

        return { success: true };
    } catch (error) {
        console.error("Notify Sync Error:", error);
        return { success: false, error: "Failed to notify and sync" };
    }
}

// --- Internal Helper: Sync Order to Shipment ---
async function syncToShipment(order: any) {
    // Check if shipment exists
    const existing = await prisma.shipment.findUnique({
        where: { trackingId: order.trackingId }
    });

    if (existing) return;

    // Create Shipment Name from Items
    const mainItem = order.items?.[0]?.itemName || "General Goods";
    const otherCount = (order.items?.length || 0) - 1;
    const itemName = otherCount > 0 ? `${mainItem} + ${otherCount} others` : mainItem;

    await prisma.shipment.create({
        data: {
            trackingId: order.trackingId,
            customerId: order.userId,
            status: order.status === "Pending" ? "Processing" : order.status,
            shipperName: itemName, // Storing Item Description in shipperName slightly hacky but maps to UI "Item" column
            recipientName: order.customerName,
            origin: "Guangzhou Warehouse",
            destination: "Ghana Branch",
        }
    });
}

// --- Admin: Update Status ---
// --- Admin: Update Unified Status (Shop or Procurement) ---
export async function updateUnifiedStatus(id: string, newStatus: string, type: 'Shop' | 'Procurement', trackingId?: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        if (type === 'Shop') {
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    status: newStatus,
                    ...(trackingId && { trackingId })
                },
                include: { items: true }
            });

            // Only sync to legacy Shipment logic if it's actually shipping out, not just arriving at warehouse
            if (updatedOrder.trackingId && newStatus !== 'Arrived' && newStatus !== 'Arrived at Warehouse') {
                await syncToShipment(updatedOrder);
            }

            await logAuditAction(
                "ORDER_STATUS_UPDATE",
                "ORDER",
                `Order status updated to ${newStatus}`,
                id,
                { newStatus, trackingId },
                user.name || "Admin"
            );
        } else {
            // Procurement Update
            await prisma.procurementRequest.update({
                where: { id },
                data: { status: newStatus }
            });

            // If status changed to Purchased/Shipped, we might want to notify user too. 
            // For now just basic update.
            await logAuditAction(
                "PROCUREMENT_STATUS_UPDATE",
                "PROCUREMENT",
                `Procurement status updated to ${newStatus}`,
                id,
                { newStatus },
                user.name || "Admin"
            );
        }

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        console.error("Update Unified Error", error);
        return { success: false, error: "Failed to update status" };
    }
}

// Keep existing for backward compat if needed, or remove.
export const updateOrderStatus = async (id: string, status: string, tracking?: string) => updateUnifiedStatus(id, status, 'Shop', tracking);

// --- Admin: Get Pending Order Count ---
export async function getPendingOrderCount() {
    const { unstable_noStore: noStore } = require('next/cache');
    noStore(); // Force dynamic behavior

    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, count: 0 };

    try {
        const [orderCount, procurementCount] = await Promise.all([
            prisma.order.count({ where: { status: "Pending" } }),
            prisma.procurementRequest.count({ where: { status: "Pending" } })
        ]);

        return { success: true, count: orderCount + procurementCount };
    } catch (error) {
        return { success: false, count: 0 };
    }
}
