"use server";
import { db } from "@/lib/db";

export async function clearAllNotifications() {
    try {
        await db.notification.deleteMany({});
        return { success: true, message: "Cleared all notifications" };
    } catch (e) {
        return { success: false, error: e };
    }
}
