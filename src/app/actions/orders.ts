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
        const orders = await prisma.order.findMany({
            include: {
                items: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: orders };
    } catch (error) {
        return { success: false, error: "Failed to fetch orders" };
    }
}

// --- Admin: Update Status ---
export async function updateOrderStatus(orderId: string, newStatus: string, trackingId?: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: newStatus,
                ...(trackingId && { trackingId })
            }
        });

        await logAuditAction(
            "ORDER_STATUS_UPDATE",
            "ORDER",
            `Order status updated to ${newStatus}`,
            orderId,
            { newStatus, trackingId },
            user.name || "Admin"
        );

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}

// --- Admin: Get Pending Order Count ---
export async function getPendingOrderCount() {
    const { unstable_noStore: noStore } = require('next/cache');
    noStore(); // Force dynamic behavior

    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, count: 0 };

    try {
        const count = await prisma.order.count({
            where: { status: "Pending" }
        });
        return { success: true, count };
    } catch (error) {
        return { success: false, count: 0 };
    }
}
