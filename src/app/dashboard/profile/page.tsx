import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, LogOut, FileText, Truck } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative">
                {/* Header */}
                <div className="bg-brand-blue h-48 rounded-b-[40px] relative z-10 pt-12 px-6">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Profile</h1>
                    </div>
                </div>

                {/* Avatar */}
                <div className="-mt-16 px-6 relative z-10 text-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 mx-auto overflow-hidden shadow-lg mb-4">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Howard" alt="Profile" />
                    </div>
                    <h2 className="text-xl font-bold text-brand-blue">Howard</h2>
                    <p className="text-xs text-slate-400">Logistics Manager</p>
                </div>

                {/* Menu */}
                <div className="px-6 space-y-3">
                    <MenuItem icon={User} label="General Account Settings" href="/dashboard/settings" />
                    <MenuItem icon={Shield} label="Change Password" href="/dashboard/settings/security" />
                    <MenuItem icon={Truck} label="Tracking IDs" href="/dashboard/shipments" />
                    <div className="h-px bg-slate-100 my-4" />
                    <MenuItem icon={FileText} label="Privacy Policy" href="/privacy" />
                    <MenuItem icon={FileText} label="Terms and Conditions" href="/terms" />

                    <Link href="/">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between mt-8 group cursor-pointer hover:border-red-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                    <LogOut size={20} />
                                </div>
                                <span className="text-sm font-bold text-red-500">Log Out</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <BottomNav />
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, label, href }: { icon: any, label: string, href?: string }) {
    const Content = (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-brand-blue/30 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Icon size={20} />
                </div>
                <span className="text-sm font-bold text-brand-blue">{label}</span>
            </div>
            <ArrowLeft size={16} className="rotate-180 text-slate-300" />
        </div>
    );

    return href ? <Link href={href}>{Content}</Link> : Content;
}
