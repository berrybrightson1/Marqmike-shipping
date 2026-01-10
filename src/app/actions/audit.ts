"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

export async function logClientAction(
    action: string,
    details: string,
    entityType: string = "USER_ACTIVITY",
    metadata?: any
) {
    try {
        const user = await getCurrentUser();
        const actorName = user ? (user.name || user.phone) : "Guest";

        await prisma.auditLog.create({
            data: {
                action,
                entityType,
                details,
                entityId: user?.id || "guest",
                actorName: actorName || "Unknown",
                metadata: metadata || {}
            }
        });

        // Only revalidate if it's a critical action, otherwise it might perform unnecessary cache invalidations
        // revalidatePath("/admin/audit"); 
    } catch (error) {
        console.error("Failed to log client action:", error);
    }
}

export async function logAuditAction(
    action: string,
    entityType: string,
    details: string,
    entityId?: string,
    valMetadata?: any,
    actorName: string = "System"
) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entityType,
                details,
                entityId,
                actorName,
                metadata: valMetadata || {}
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
    }
}

export async function getAuditLogs() {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            take: 100
        });
        return { success: true, data: logs };
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return { success: false, data: [] };
    }
}
