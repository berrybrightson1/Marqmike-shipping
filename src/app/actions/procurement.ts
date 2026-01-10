"use server";

import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { logAuditAction } from "@/app/actions/audit";

export async function getAdminProcurementRequests() {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        const requests = await prisma.procurementRequest.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        // pointOfContact removed as it doesn't exist on User model
                        phone: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: requests };
    } catch (error) {
        console.error("Fetch Requests Error:", error);
        return { success: false, error: "Failed to fetch requests" };
    }
}

export async function getUserProcurementRequests() {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const requests = await prisma.procurementRequest.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: requests };
    } catch (error) {
        console.error("Fetch User Requests Error:", error);
        return { success: false, error: "Failed to fetch your requests" };
    }
}

export async function createProcurementRequest(data: {
    itemName: string;
    itemUrl: string;
    notes?: string;
}) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const req = await prisma.procurementRequest.create({
            data: {
                userId: user.id,
                itemName: data.itemName,
                itemUrl: data.itemUrl,
                notes: data.notes,
                status: "Pending"
            }
        });

        await logAuditAction(
            "PROCUREMENT_REQUEST_CREATED",
            "PROCUREMENT",
            `New Request: ${data.itemName}`,
            req.id,
            { itemUrl: data.itemUrl },
            user.businessName || user.name || "User"
        );

        revalidatePath("/dashboard/procurement");
        revalidatePath("/admin/procurement");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create request" };
    }
}

export async function updateProcurementStatus(id: string, newStatus: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        await prisma.procurementRequest.update({
            where: { id },
            data: { status: newStatus }
        });

        await logAuditAction(
            "PROCUREMENT_STATUS_UPDATE",
            "PROCUREMENT",
            `Request status updated to ${newStatus}`,
            id,
            { newStatus },
            user.name || "Admin"
        );

        revalidatePath("/admin/procurement");
        revalidatePath("/dashboard/procurement");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}
