import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react";
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
                    <MenuItem icon={User} label="Edit Profile" />
                    <MenuItem icon={Bell} label="Notifications" />
                    <MenuItem icon={Shield} label="Privacy & Security" />

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

function MenuItem({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-brand-blue/30 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Icon size={20} />
                </div>
                <span className="text-sm font-bold text-brand-blue">{label}</span>
            </div>
            <ArrowLeft size={16} className="rotate-180 text-slate-300" />
        </div>
    )
}
