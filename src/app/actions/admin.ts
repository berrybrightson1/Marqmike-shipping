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

export async function getCustomers(query?: string, filter?: string) {
    try {
        const where: any = { role: "CUSTOMER" };

        if (query) {
            where.OR = [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    where: { status: { not: "Cancelled" } },
                    select: { totalAmount: true }
                }
            }
        });

        const mappedUsers = users.map(u => {
            const totalSpent = u.orders.reduce((sum, order) => sum + order.totalAmount, 0);

            // Determine type dynamically if not set
            let type = "Regular";
            if (totalSpent > 5000) type = "Premium";
            if (u.businessName) type = "Business";

            // Apply filter logic in memory if complex, or ideally in DB query if possible.
            // Since "type" is derived, we filter here for now.
            if (filter && filter !== "All") {
                if (filter === "Business" && type !== "Business") return null;
                if (filter === "Premium" && type !== "Premium") return null;
            }

            return {
                id: u.id,
                name: u.name || u.email?.split("@")[0] || "Unknown",
                email: u.email || "No Email",
                phone: u.phone || "No Phone",
                type,
                orders: u._count.orders,
                spent: `₵${totalSpent.toLocaleString()}`,
                rawSpent: totalSpent
            };
        }).filter(Boolean); // Remove nulls from filtering

        return { success: true, data: mappedUsers };
    } catch (error) {
        console.error("Get Customers Error:", error);
        return { success: false, data: [] };
    }
}

export async function getAdminStats() {
    try {
        // Parallel fetch for speed
        const [
            activeShipments,
            totalCustomers,
            pendingRequests,
            revenueResult,
            chartsData
        ] = await Promise.all([
            prisma.shipment.count({ where: { status: { not: "Delivered" } } }),
            prisma.user.count({ where: { role: "CUSTOMER" } }),
            prisma.procurementRequest.count({ where: { status: "Pending" } }),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: "Cancelled" } }
            }),
            getAdminChartData()
        ]);

        return {
            success: true,
            data: {
                revenue: revenueResult._sum.totalAmount || 0,
                activeShipments,
                totalCustomers,
                pendingRequests,
                charts: chartsData.success ? chartsData.data : null
            }
        };
    } catch (error) {
        console.error("Stats Error:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function getRecentAuditLogs(limit: number = 10) {
    try {
        const logs = await prisma.auditLog.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' }
        });

        const activities = logs.map(log => ({
            id: log.id,
            title: `${log.actorName} - ${log.action}`, // E.g. "System - ORDER_CREATED"
            desc: log.details,
            time: log.timestamp,
            entityType: log.entityType, // Pass this to UI for icon selection
            type: 'system'
        }));

        return { success: true, data: activities };
    } catch (error) {
        console.error("Audit Logs Error:", error);
        return { success: false, data: [] };
    }
}

export async function getAdminChartData() {
    try {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31);

        // 1. Fetch Orders and Shipments for the current year
        const [orders, shipments] = await Promise.all([
            prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startOfYear,
                        lte: endOfYear
                    },
                    status: { not: "Cancelled" }
                },
                select: { createdAt: true, totalAmount: true }
            }),
            prisma.shipment.findMany({
                where: {
                    createdAt: {
                        gte: startOfYear,
                        lte: endOfYear
                    }
                },
                select: { createdAt: true }
            })
        ]);

        // 2. Aggregate Data by Month (JS-side for simplicity)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const shipmentData = months.map((month, index) => {
            const count = shipments.filter(s => s.createdAt.getMonth() === index).length;
            return { name: month, shipments: count };
        });

        const revenueData = months.map((month, index) => {
            const total = orders
                .filter(o => o.createdAt.getMonth() === index)
                .reduce((sum, o) => sum + o.totalAmount, 0);
            return { name: month, revenue: total };
        });

        // 3. Trim to current month? Optional, but let's show full year for now or up to current month
        // For visual balance, we'll return all months.

        return {
            success: true,
            data: {
                shipmentData,
                revenueData
            }
        };
    } catch (error) {
        console.error("Chart Data Error:", error);
        return { success: false, error: "Failed to fetch chart data" };
    }
}
