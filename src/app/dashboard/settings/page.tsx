"use client";

import { User, Bell, Globe, Shield, HelpCircle, ChevronRight, LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header */}
            <div className="bg-brand-blue pt-12 pb-12 px-6 rounded-b-[40px] mb-6 relative z-10">
                <button onClick={() => router.back()} className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center mt-2">
                    <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                </div>
            </div>

            <div className="px-6 -mt-16">
                {/* Profile Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-brand-blue/5 mb-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden mb-3">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Howard" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-lg font-bold text-brand-blue">Howard</h2>
                    <span className="px-3 py-1 bg-brand-pink/10 text-brand-pink text-[10px] font-bold rounded-full uppercase tracking-wider">Super Admin</span>
                </div>

                {/* Settings Groups */}
                <div className="space-y-6">
                    <SettingsGroup title="Account">
                        <SettingsItem icon={User} label="Personal Information" />
                        <SettingsItem icon={Bell} label="Notifications" />
                    </SettingsGroup>

                    <SettingsGroup title="System">
                        <SettingsItem icon={Globe} label="Language & Region" value="English (US)" />
                        <SettingsItem icon={Shield} label="Security" />
                    </SettingsGroup>

                    <SettingsGroup title="Support">
                        <SettingsItem icon={HelpCircle} label="Help Center" />
                    </SettingsGroup>

                    {/* Admin Access (Hidden for non-admins normally) */}
                    <Link
                        href="/admin/shipments"
                        className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
                    >
                        <Shield size={20} />
                        Switch to Admin Panel
                    </Link>

                    <button
                        onClick={() => toast.success("Logged out successfully")}
                        className="w-full bg-white p-4 rounded-2xl text-red-500 font-bold flex items-center justify-center gap-2 shadow-sm border border-red-50 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">{title}</h3>
            <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
                {children}
            </div>
        </div>
    )
}

function SettingsItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) {
    return (
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Icon size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
                <ChevronRight size={16} className="text-slate-300" />
            </div>
        </div>
    )
}
