"use client";

import { LayoutGrid, Users, Box, Phone, Settings, LogOut, Shield, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-slate-900 border-r border-slate-800 z-50 text-white">
            {/* Header / Brand */}
            <div className="p-6 flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold italic">
                    M
                </div>
                <span className="text-xl font-bold tracking-tight">Marqmike <span className="text-brand-pink text-xs uppercase ml-1">Admin</span></span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <AdminSidebarItem icon={LayoutGrid} label="Overview" href="/admin" isActive={pathname === "/admin"} />
                <AdminSidebarItem icon={Box} label="Shipments" href="/admin/shipments" isActive={pathname.includes("/shipments")} />
                <AdminSidebarItem icon={Users} label="Customers" href="/admin/customers" isActive={pathname.includes("/customers")} />
                <AdminSidebarItem icon={ShoppingBag} label="Procurement" href="/admin/procurement" isActive={pathname.includes("/procurement")} />

                {/* Reports Group */}
                <div className="pt-4 pb-1 pl-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Reports</div>
                <AdminSidebarItem icon={Phone} label="Call Logs" href="/admin/calls" isActive={pathname.includes("/calls")} />
                <AdminSidebarItem icon={Shield} label="Audit Logs" href="/admin/audit" isActive={pathname.includes("/audit")} />

                <div className="pt-4 pb-1 pl-4 text-xs font-bold text-slate-600 uppercase tracking-widest">System</div>
                <AdminSidebarItem icon={Settings} label="Settings" href="/admin/settings" isActive={pathname.includes("/settings")} />
            </nav>

            {/* Footer Profile */}
            <div
                onClick={async () => {
                    await signOut();
                    window.location.href = "/auth/login";
                }}
                className="p-4 m-4 bg-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center font-bold text-sm border border-brand-pink/30">
                        SA
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Super Admin</h4>
                        <p className="text-[10px] text-slate-400">admin@marqmike.com</p>
                    </div>
                </div>
                <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            </div>

            <div className="px-6 pb-6 pt-2">
                <Link href="/dashboard" className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition-colors">
                    <LayoutGrid size={14} /> Switch to Customer View
                </Link>
            </div>
        </aside>
    );
}

function AdminSidebarItem({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive?: boolean }) {
    return (
        <Link href={href}>
            <div className={`p-3.5 flex items-center gap-3 rounded-xl transition-all ${isActive ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
            </div>
        </Link>
    )
}
