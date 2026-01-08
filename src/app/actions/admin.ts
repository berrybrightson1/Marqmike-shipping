"use server";

import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function logCall(data: {
    customerName: string;
    phoneNumber: string;
    summary: string;
    outcome: string;
    topic: string;
}) {
    // For now we assume a static admin ID or we would get it from auth
    const adminId = "clk_admin_123";

    try {
        await prisma.callLog.create({
            data: {
                ...data,
                adminId,
            }
        });
        revalidatePath("/admin/calls");
        return { success: true };
    } catch (error) {
        console.error("Failed to log call:", error);
        return { success: false, error: "Failed to create log" };
    }
}

export async function getRecentLogs() {
    try {
        const logs = await prisma.callLog.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 20
        });
        return { success: true, data: logs };
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        return { success: false, data: [] };
    }
}

export async function getCustomers() {
    try {
        const users = await prisma.user.findMany({
            take: 50,
            select: { id: true, email: true }
        });

        let mappedUsers = users.map(u => ({
            id: u.id,
            name: u.email.split('@')[0],
            phone: "",
            email: u.email
        }));

        if (mappedUsers.length === 0) {
            mappedUsers = [
                { id: "mock-1", name: "Alice Johnson", phone: "+233 20 123 4567", email: "alice@example.com" },
                { id: "mock-2", name: "Kofi Mensah", phone: "+233 24 987 6543", email: "kofi@example.com" },
                { id: "mock-3", name: "Sarah Williams", phone: "+233 50 111 2222", email: "sarah@example.com" },
                { id: "mock-4", name: "David Osei", phone: "+233 27 555 8888", email: "david@example.com" },
                { id: "mock-5", name: "Ama Boateng", phone: "+233 26 777 9999", email: "ama@example.com" }
            ];
        }

        return { success: true, data: mappedUsers };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function getAdminStats() {
    try {
        const [activeShipments, totalCustomers, pendingRequests] = await Promise.all([
            prisma.shipment.count({ where: { status: { not: "Delivered" } } }),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.procurementRequest.count({ where: { status: "Pending" } })
        ]);

        return {
            success: true,
            data: {
                revenue: 45231.89, // Mocked for now until Order model has amount
                activeShipments,
                totalCustomers,
                pendingRequests
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function getInventory() {
    try {
        const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        return { success: true, data: products };
    } catch (error) {
        return { success: false, error: "Failed to fetch inventory" };
    }
}

export async function getProcurementRequests() {
    try {
        const requests = await prisma.procurementRequest.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: requests };
    } catch (error) {
        return { success: false, error: "Failed to fetch requests" };
    }
}

export async function getCustomersWithStats() {
    try {
        const users = await prisma.user.findMany({
            where: { role: "USER" },
            include: {
                _count: {
                    select: { orders: true }
                }
            },
            take: 100
        });

        const mapped = (users as any[]).map(u => ({
            id: u.id,
            name: u.name || "Unknown",
            email: u.email,
            phone: u.phone || "N/A",
            type: "Standard", // Logic for type can be added later
            orders: u._count.orders,
            spent: "$0.00" // Placeholder
        }));

        return { success: true, data: mapped };
    } catch (error) {
        return { success: false, error: "Failed to fetch customers" };
    }
}

export async function getRecentAuditLogs() {
    try {
        // Fetch recent shipment events as "Audit Logs" for now
        const events = await prisma.shipmentEvent.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: { shipment: true }
        });

        const activities = events.map(e => ({
            id: e.id,
            title: `Shipment ${e.status}`,
            desc: `Order #${e.shipment.trackingId} - ${e.location}`,
            time: e.timestamp, // Will format close to UI time
            type: 'shipment'
        }));

        return { success: true, data: activities };
    } catch (error) {
        return { success: false, data: [] };
    }
}
