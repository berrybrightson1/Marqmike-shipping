"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, ClipboardList, Settings, LogOut, X, Menu, PhoneCall, Shield, User } from "lucide-react";
import { useState } from "react";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) =>
        path === "/admin"
            ? pathname === "/admin"
            : pathname === path || pathname.startsWith(`${path}/`);

    const groups = [
        {
            title: "", // Main group has no title
            items: [
                { name: "Overview", href: "/admin", icon: LayoutDashboard },
                { name: "Shipments", href: "/admin/shipments", icon: Package },
                { name: "Customers", href: "/admin/customers", icon: User }, // Added based on image
                { name: "Procurement", href: "/admin/procurement", icon: ShoppingBag },
            ]
        },
        {
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
                md:translate-x-0 md:relative md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-full bg-white text-brand-blue flex items-center justify-center shadow-lg shadow-black/10">
                        <span className="font-bold text-lg italic">M</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight text-white">Marqmike <span className="text-white/80 text-xs uppercase tracking-widest ml-1">ADMIN</span></h1>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Sidebar"
                        className="md:hidden ml-auto text-white/50 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
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
                                            <Icon size={20} className={active ? 'text-[#ff1493]' : 'text-white/70 group-hover:text-white'} />
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
