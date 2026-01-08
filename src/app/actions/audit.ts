"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function logAuditAction(action: string, details: string, adminName: string = "Super Admin") {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                details,
                adminName
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
            take: 50
        });
        return { success: true, data: logs };
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return { success: false, data: [] };
    }
}
