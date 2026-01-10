"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, ClipboardList, Settings, LogOut, X, Menu, PhoneCall, Shield, User, HelpCircle } from "lucide-react";
import { getPendingOrderCount } from "@/app/actions/orders";
import { useEffect, useState } from "react";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [pendingOrders, setPendingOrders] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const res = await getPendingOrderCount();
            if (res.success) setPendingOrders(res.count);
        };
        fetchCount();

        // Poll every 2 seconds for "real-time" feel
        const interval = setInterval(fetchCount, 2000);
        return () => clearInterval(interval);
    }, []);

    const isActive = (path: string) =>
        path === "/admin"
            ? pathname === "/admin"
            : pathname === path || pathname.startsWith(`${path}/`);

    const groups = [
        {
            title: "", // Main group has no title
            items: [
                { name: "Overview", href: "/admin", icon: LayoutDashboard },
                { name: "Shop Orders", href: "/admin/orders", icon: ShoppingBag, badge: pendingOrders },
                { name: "Procurement Requests", href: "/admin/procurement", icon: ClipboardList },
                { name: "Customer Shipments", href: "/admin/shipments", icon: Package },
                { name: "Customers", href: "/admin/customers", icon: User },
                { name: "Inventory", href: "/admin/inventory", icon: LayoutDashboard },
            ]
        },
        {
            // ... rest of code
            title: "REPORTS",
            items: [
                { name: "Call Logs", href: "/admin/calls", icon: PhoneCall },
                { name: "Audit Logs", href: "/admin/audit", icon: Shield },
            ]
        },
        {
            title: "SYSTEM",
            items: [
                { name: "Settings", href: "/admin/settings", icon: Settings },
                { name: "Help Center", href: "/help", icon: HelpCircle },
            ]
        }
    ];

    // Flat list for active checking if needed, or just iterate groups

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open Sidebar"
                className="md:hidden fixed top-4 right-4 z-50 bg-brand-pink text-white p-2 rounded-full shadow-lg"
            >
                <Menu size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-screen bg-brand-blue text-white w-72 p-6 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out
                md:translate-x-0 md:fixed md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    {/* Replaced with Long Logo */}
                    <img
                        src="/logos/Long logo.svg"
                        alt="Marqmike Admin"
                        className="h-12 w-auto object-contain brightness-0 invert"
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Sidebar"
                        className="md:hidden ml-auto text-white/50 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto space-y-8 pr-2 no-scrollbar">
                    {groups.map((group, idx) => (
                        <div key={idx}>
                            {group.title && (
                                <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-4 px-4">{group.title}</h3>
                            )}
                            <div className="space-y-2">
                                {group.items.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.href);

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`
                                                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm relative
                                                ${active
                                                    ? 'bg-white text-brand-blue shadow-lg shadow-black/10'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'}
                                            `}
                                        >
                                            <div className="relative">
                                                <Icon size={20} className={active ? 'text-[#ff1493]' : 'text-white/70 group-hover:text-white'} />
                                                {link.badge && link.badge > 0 ? (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                                        {link.badge}
                                                    </span>
                                                ) : null}
                                            </div>
                                            <span>{link.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer / User Profile */}
                <div className="mt-auto pt-6">
                    {/* User Profile */}
                    <div className="p-4 rounded-[24px] bg-[#053b87] border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue font-bold">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">Admin User</p>
                                <p className="text-xs text-white/60 truncate">admin@marqmike.com</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10">
                            <AdminLogoutButton />
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full mt-4 text-xs font-bold text-center text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
                    >
                        <LayoutDashboard size={14} />
                        Switch to Customer View
                    </button>
                </div>
            </aside>
        </>
    );
}
