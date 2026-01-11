"use client";

import { User, Bell, Globe, Shield, HelpCircle, ChevronRight, LogOut, ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { updateProfile, signOut } from "@/app/actions/auth";

export default function SettingsView({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully");
        router.push("/auth/login");
    };

    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            {/* Context for Edit Modal */}
            {isEditOpen && (
                <EditProfileModal user={user} onClose={() => setIsEditOpen(false)} />
            )}

            {/* Header */}
            <div className="bg-brand-blue pt-12 pb-12 px-6 rounded-b-[40px] mb-6 relative z-10 shrink-0 shadow-xl shadow-brand-blue/20">
                <button onClick={() => router.back()} className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center mt-2">
                    <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                </div>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                {/* Profile Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-brand-blue/5 mb-6 flex flex-col items-center text-center relative group">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="absolute top-4 right-4 text-brand-blue/50 hover:text-brand-blue p-2 hover:bg-brand-blue/5 rounded-full transition-colors"
                    >
                        <User size={20} />
                    </button>
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden mb-3 bg-brand-pink/10 flex items-center justify-center">
                        <img
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name || 'User'}`}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-lg font-bold text-brand-blue">{user.businessName || user.name || "Guest User"}</h2>
                    <p className="text-xs text-slate-400 font-bold mb-2">{user.phone}</p>
                    <span className="px-3 py-1 bg-brand-pink/10 text-brand-pink text-[10px] font-bold rounded-full uppercase tracking-wider">{user.role || "Customer"}</span>
                </div>

                {/* Settings Groups */}
                <div className="space-y-6">
                    <SettingsGroup title="Account">
                        <SettingsItem icon={User} label="Edit Profile" onClick={() => setIsEditOpen(true)} />
                        <SettingsItem icon={Lock} label="Change Password" onClick={() => router.push("/dashboard/settings/security")} />
                        <SettingsItem icon={Bell} label="Notifications" />
                    </SettingsGroup>
// ... rest of code
                    <SettingsGroup title="System">
                        <SettingsItem icon={Globe} label="Language & Region" value="English (US)" />
                        <SettingsItem icon={Shield} label="Security" />
                    </SettingsGroup>

                    <SettingsGroup title="Support">
                        <SettingsItem icon={HelpCircle} label="Help Center" />
                    </SettingsGroup>

                    {/* Admin Access */}
                    {user.role === "ADMIN" && (
                        <Link
                            href="/admin/shipments"
                            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
                        >
                            <Shield size={20} />
                            Switch to Admin Panel
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
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



function EditProfileModal({ user, onClose }: { user: any, onClose: () => void }) {
    const [name, setName] = useState(user.name || "");
    const [businessName, setBusinessName] = useState(user.businessName || "");
    const [email, setEmail] = useState(user.email || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        const res = await updateProfile({ name, businessName, email });
        setLoading(false);
        if (res.success) {
            toast.success("Profile updated");
            router.refresh(); // Refresh to show new data
            onClose();
        } else {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"><LogOut size={16} className="rotate-180" /></button> {/* Using LogOut as X icon alias or just X if imported */}

                <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Profile</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Business Name (Mandatory)</label>
                        <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-brand-blue" placeholder="e.g. Ama Stores" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Email (Optional)</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-brand-blue" type="email" />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-brand-blue text-white font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all mt-4"
                    >
                        {loading ? "Saving..." : "Save Changes"}
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

function SettingsItem({ icon: Icon, label, value, onClick }: { icon: any, label: string, value?: string, onClick?: () => void }) {
    return (
        <div onClick={onClick} className="px-5 py-4 flex items-center justify-between border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/5 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Icon size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-xs font-bold text-slate-400 max-w-[120px] truncate">{value}</span>}
                <ChevronRight size={16} className="text-slate-300" />
            </div>
        </div>
    )
}
