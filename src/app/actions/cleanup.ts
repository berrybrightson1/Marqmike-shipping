"use server";
import { prisma as db } from "@/lib/prisma";

export async function clearAllNotifications() {
    try {
        await db.notification.deleteMany({});
        return { success: true, message: "Cleared all notifications" };
    } catch (e) {
        return { success: false, error: e };
    }
}
