"use client";

import { Shield, Bell, Lock, User, LogOut, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20 bg-[#F2F6FC]">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin Settings</h1>
                <p className="text-slate-500 mt-1">Manage system configurations and admin access.</p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* Profile Section */}
                <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-brand-blue/5 flex items-center justify-center">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Super Admin</h2>
                        <p className="text-slate-400 text-sm">admin@marqmike.com</p>
                        <div className="flex gap-2 mt-3">
                            <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-xs font-bold">Full Access</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                        </div>
                    </div>
                </div>

                {/* Settings Groups */}
                <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-lg shadow-slate-200/50">
                        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System & Security</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            <SettingsItem icon={Lock} label="Change Password" />
                            <Link href="/dashboard/settings/addresses">
                                <SettingsItem icon={MapPin} label="Address Book" />
                            </Link>
                            <SettingsItem icon={Shield} label="Two-Factor Authentication" value="Enabled" />
                            <SettingsItem icon={Bell} label="System Notifications" />
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-lg shadow-slate-200/50">
                        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Management</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            <SettingsItem icon={User} label="Manage Admins" value="3 Active" />
                        </div>
                    </div>

                    <button
                        onClick={() => toast.success("Admin session terminated")}
                        className="w-full bg-red-50 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Log Out Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) {
    return (
        <div className="px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Icon size={18} />
                </div>
                <span className="font-bold text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {value && <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{value}</span>}
                <ChevronRight size={18} className="text-slate-300" />
            </div>
        </div>
    )
}
