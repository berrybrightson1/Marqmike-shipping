"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
    const user = await getCurrentUser();
    if (!user) return { data: [] };

    try {
        const notifications = (await db.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })) || []; // Fallback if undefined

        return { success: true, data: notifications };
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return { success: false, data: [] };
    }
}

export async function markAllNotificationsRead() {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    try {
        await db.notification.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true }
        });
        revalidatePath("/dashboard/notifications");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update" };
    }
}

export async function sendSystemNotification(userId: string, title: string, message: string) {
    try {
        await db.notification.create({
            data: {
                userId,
                title,
                message,
                type: 'system',
                read: false
            }
        });
        // In a real app, this would also trigger a WebSocket or push notification event
        // revalidatePath(`/dashboard`); // Optional, but expensive if called frequently
        return { success: true };
    } catch (error) {
        console.error("Send Notification Error:", error);
        return { success: false, error: "Failed to send notification" };
    }
}

export async function broadcastNotification(title: string, message: string) {
    const admin = await getCurrentUser();
    if (!admin) {
        console.error("Broadcast: No admin user found");
        return { success: false, count: 0, error: "Unauthorized" };
    }

    try {
        console.log("Broadcast: Starting broadcast...", { title, message, admin: admin.name });

        // Get all users
        const users = await db.user.findMany({
            select: { id: true }
        });

        console.log(`Broadcast: Found ${users.length} users`);

        if (users.length === 0) {
            console.warn("Broadcast: No users found in database");
            return { success: true, count: 0 };
        }

        // Create notifications for all users
        await db.notification.createMany({
            data: users.map(user => ({
                userId: user.id,
                title,
                message,
                type: 'system' as const,
                read: false
            }))
        });

        console.log(`Broadcast: Successfully sent to ${users.length} users`);

        // Log admin action to audit log
        const { logAuditAction } = await import("./audit");
        await logAuditAction(
            "BROADCAST_NOTIFICATION",
            "ADMIN_ACTION",
            `Admin "${admin.name || admin.phone}" sent broadcast: "${title}"`,
            admin.id,
            { title, message, recipientCount: users.length },
            admin.name || admin.phone || "Admin"
        );

        console.log("Broadcast: Audit log created successfully");

        revalidatePath("/dashboard/notifications");
        revalidatePath("/admin/audit");

        return { success: true, count: users.length };
    } catch (error) {
        console.error("Broadcast Error:", error);
        return { success: false, count: 0, error: "Failed to broadcast" };
    }
}
