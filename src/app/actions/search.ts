"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./auth";

export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { results: [] };

    try {
        const lowerQuery = query.toLowerCase();

        // Parallel search
        const [shipments, customers, orders] = await Promise.all([
            // Search Shipments
            db.shipment.findMany({
                where: { OR: [{ trackingId: { contains: query } }, { recipientName: { contains: query } }] },
                take: 3,
                select: { trackingId: true, recipientName: true, status: true }
            }),
            // Search Customers (Users)
            db.user.findMany({
                where: { OR: [{ name: { contains: query } }, { email: { contains: query } }, { phone: { contains: query } }] },
                take: 3,
                select: { id: true, name: true, email: true }
            }),
            // Search Orders
            db.order.findMany({
                where: { OR: [{ refCode: { contains: query } }, { customerName: { contains: query } }] },
                take: 3,
                select: { id: true, refCode: true, customerName: true, status: true }
            })
        ]);

        const results = [
            // Static Admin Pages
            ...filterStaticPages(query),

            // Shipments
            ...shipments.map(s => ({
                type: 'Shipment',
                title: s.trackingId,
                desc: `${s.recipientName} • ${s.status}`,
                href: `/admin/shipments/${s.trackingId}`,
                icon: 'Package'
            })),

            // Customers
            ...customers.map(c => ({
                type: 'Customer',
                title: c.name || "Unknown",
                desc: c.email || "No email",
                href: `/admin/customers/${c.id}`,
                icon: 'User'
            })),

            // Orders
            ...orders.map(o => ({
                type: 'Order',
                title: o.refCode || o.id.slice(0, 8),
                desc: `${o.customerName} • ${o.status}`,
                href: `/admin/orders/${o.id}`, // Assuming this route exists, checking later
                icon: 'ShoppingCart'
            }))
        ];

        return { success: true, results };

    } catch (error) {
        console.error("Search Error:", error);
        return { success: false, results: [] };
    }
}

function filterStaticPages(query: string) {
    const pages = [
        { title: "Dashboard", href: "/admin" },
        { title: "Shipments", href: "/admin/shipments" },
        { title: "Customers", href: "/admin/customers" },
        { title: "Settings", href: "/admin/settings" },
        { title: "Audit Logs", href: "/admin/audit" },
        { title: "Support Desk", href: "/admin/support" },
    ];

    return pages
        .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        .map(p => ({ type: 'Page', title: p.title, desc: 'Go to page', href: p.href, icon: 'Settings' }));
}
