"use server";

import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/app/actions/auth";
import { broadcastNotification } from "@/app/actions/notification";
import { revalidatePath } from "next/cache";

export async function updateSystemSetting(key: string, value: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        revalidatePath("/admin/settings");
        revalidatePath("/dashboard/create"); // CBM Calc might need revalidation if fetched server side
        return { success: true };
    } catch (error) {
        console.error("Update Setting Error:", error);
        return { success: false, error: "Failed to update setting" };
    }
}

export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        });
        return { success: true, value: setting?.value || null };
    } catch (error) {
        return { success: false, value: null };
    }
}

export async function sendPromoNotification(rate: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        await broadcastNotification(
            "🔥 New Shipping Rate Alert!",
            `Great news! Our sea freight rate has been updated to $${rate}/CBM. Start shipping now to enjoy these rates.`
        );
        return { success: true };
    } catch (error) {
        console.error("Promo Error:", error);
        return { success: false, error: "Failed to send notifications" };
    }
}
