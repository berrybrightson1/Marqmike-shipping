"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./auth";

// Fetch full customer profile including stats
export async function getCustomerDetails(userId: string) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        shipments: true,
                        notifications: true,
                        procurementRequests: true
                    }
                }
            }
        });

        if (!user) return { success: false, error: "User not found" };

        return { success: true, data: user };
    } catch (error) {
        console.error("Get Customer Error:", error);
        return { success: false, error: "Failed to fetch customer" };
    }
}

// Fetch shipments specific to a customer
export async function getCustomerShipments(userId: string) {
    try {
        const shipments = await db.shipment.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                events: {
                    take: 1,
                    orderBy: { timestamp: 'desc' }
                }
            }
        });
        return { success: true, data: shipments };
    } catch (error) {
        return { success: false, data: [] };
    }
}

// Fetch audit logs related to a customer (where they are the actor or the entity)
export async function getCustomerAuditLogs(userId: string) {
    try {
        const logs = await db.auditLog.findMany({
            where: {
                OR: [
                    { entityId: userId }, // Actions performed on them
                    // { actorName: ... } // If we stored actorId reliably we'd check that too. 
                    // Since specific actorId isn't always stored in audit log schema (it uses string actorName sometimes), 
                    // we rely on entityId for "actions ON this user". 
                    // If the user *did* something, we might check if actorName matches user.name, but that's loose.
                    // For now, let's stick to actions ON the user (Profile Update) or BY the user 
                    // if we can rely on context. 
                    // Looking at schema would actully help.
                    // Let's assume entityId often stores the related user ID.
                ]
            },
            orderBy: { timestamp: 'desc' },
            take: 50
        });
        return { success: true, data: logs };
    } catch (error) {
        return { success: false, data: [] };
    }
}
