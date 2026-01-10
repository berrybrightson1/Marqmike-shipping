"use client";

import { LayoutGrid, Box, FileText, User, Settings, LogOut, Plus, Users, Calendar, Truck, BarChart2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// navItems removed as we now use direct MenuGroups

import { signOut } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const result = await signOut();
        if (result.success) {
            toast.success("Logged out successfully");
            router.push("/auth/login");
        } else {
            toast.error("Logout failed");
        }
    };

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 z-50">
            {/* ... (rest of sidebar) ... */}

            {/* Footer Profile */}
            <div
                onClick={handleLogout}
                className="p-4 m-4 bg-slate-50 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-red-50 hover:border-red-100 border border-transparent transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center font-bold text-sm">
                        SA
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 group-hover:text-red-500">Super Admin</h4>
                        <p className="text-[10px] text-slate-400 group-hover:text-red-300">Tap to logout</p>
                    </div>
                </div>
                <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </div>
        </aside>
    );
}

function MenuGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-3">{title}</h3>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    )
}

function SidebarItem({ icon: Icon, label, href, isActive }: { icon: any, label: string, href: string, isActive?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                isActive
                    ? "bg-brand-blue/5 text-brand-blue font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-brand-blue" : "text-slate-400 group-hover:text-slate-600"} />
            {label}
        </Link>
    )
}

function GlassCardCompact() {
    return (
        <div className="bg-gradient-to-br from-brand-blue to-[#003d91] rounded-[32px] p-6 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/20">
            <div className="relative z-10">
                <p className="text-xs font-medium text-white/60 mb-1">Quick Action</p>
                <h3 className="font-bold text-lg mb-4">New Shipment</h3>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all">
                    <Plus size={18} strokeWidth={3} /> Create
                </button>
            </div>
            {/* Decor */}
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-brand-pink/20 rounded-full blur-xl" />
        </div>
    )
}
