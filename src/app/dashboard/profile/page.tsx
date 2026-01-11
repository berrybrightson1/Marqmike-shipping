import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, LogOut, FileText, Truck, ChevronRight } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { getCurrentUser, signOut } from "@/app/actions/auth"; // Assuming signOut is needed or handled in a client component? 
// Actually, MenuItem can treat Logout special if needed, but the original code had a Link to '/'.
// Let's stick to the requested structure but with real data.

export default async function ProfilePage() {
    const user = await getCurrentUser();
    const name = user?.name || user?.businessName || "Guest User";
    const role = user?.role || "Customer";
    const avatarSeed = user?.name || "User";

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative">
                {/* Header */}
                <div className="bg-brand-blue h-48 rounded-b-[40px] relative z-10 pt-12 px-6 shadow-xl shadow-brand-blue/20">
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
                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`} alt="Profile" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{name}</h2>
                    <p className="text-xs text-brand-pink font-bold bg-brand-pink/10 inline-block px-3 py-1 rounded-full mt-1 uppercase tracking-wide">{role}</p>
                </div>

                {/* Menu */}
                <div className="px-6 space-y-3">
                    <MenuItem icon={User} label="General Account Settings" href="/dashboard/settings" />
                    <MenuItem icon={Shield} label="Change Password" href="/dashboard/settings/security" />
                    <MenuItem icon={Truck} label="Tracking IDs" href="/dashboard/shipments" />

                    <div className="h-px bg-slate-100 my-4" />

                    <MenuItem icon={FileText} label="Privacy Policy" href="/privacy" />
                    <MenuItem icon={FileText} label="Terms and Conditions" href="/terms" />

                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <button type="submit" className="w-full">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between mt-8 group cursor-pointer hover:border-red-100 hover:bg-red-50/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                        <LogOut size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-red-500">Log Out</span>
                                </div>
                            </div>
                        </button>
                    </form>
                </div>

                <BottomNav />
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, label, href }: { icon: any, label: string, href?: string }) {
    const Content = (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-brand-blue/30 hover:shadow-md hover:shadow-brand-blue/5 transition-all group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-colors">
                    <Icon size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue transition-colors">{label}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
        </div>
    );

    return href ? <Link href={href}>{Content}</Link> : Content;
}
