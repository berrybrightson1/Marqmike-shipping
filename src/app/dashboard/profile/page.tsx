"use client";


import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, LogOut, FileText, Truck, ChevronRight, Mail, Briefcase, Phone, Lock, Save, Edit2 } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { signOut, updateProfile } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions/auth";

// We need to fetch user data. Since we want client interactivity for editing, we can fetch in useEffect or pass initial data.
// For simplicity in this "use client" rewrite, we'll fetch on mount or use a server wrapper. 
// However, the previous version was a Server Component. Let's make this a Client Component that fetches data or 
// better yet, keeps the Page as Server Component and passes user to a distinct Client View.
// But refactoring to client view is cleaner. Let's do that pattern.

export default function ProfilePageWrapper() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser().then((u) => {
            setUser(u);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="min-h-screen bg-[#F2F6FC] flex items-center justify-center"><div className="animate-spin w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full" /></div>;

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <p>Please sign in</p>
            <Link href="/login" className="text-brand-blue font-bold">Sign In</Link>
        </div>
    );

    return <ProfileView user={user} />;
}

function ProfileView({ user: initialUser }: { user: any }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user.name || "",
        businessName: user.businessName || "",
        email: user.email || "",
        phone: user.phone || ""
    });

    const handleSave = async () => {
        setSaving(true);
        const res = await updateProfile({
            name: formData.name,
            businessName: formData.businessName,
            email: formData.email,
            phone: formData.phone // Allowing phone update? Usually dangerous if it's the ID. Let's assume yes or restrict it. 
            // User schema has phone as unique ID essentially. Changing it might require verification. 
            // For now, let's allow updating non-critical fields or assume phone update is handled safe. 
            // Actually, `updateProfile` action supports phone update.
        });

        if (res.success) {
            toast.success("Profile updated");
            setIsEditing(false);
            setUser({ ...user, ...formData });
        } else {
            toast.error("Failed to update");
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">

                {/* Minimal Header */}
                <div className="pt-8 px-6 pb-4 flex items-center justify-between z-20">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-blue transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">My Profile</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">

                    {/* Avatar Section */}
                    <div className="text-center mb-8 mt-2 relative">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 mx-auto overflow-hidden shadow-lg mb-4 relative group">
                            <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name || 'User'}`} alt="Profile" className="w-full h-full object-cover" />
                        </div >
                        <h2 className="text-xl font-bold text-slate-800">{user.name || "Guest"}</h2>
                        <p className="text-sm font-medium text-slate-500">{user.businessName}</p>
                    </div >

                    {/* Account Details Form */}
                    < div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-6" >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">Account Details</h3>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={saving}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isEditing
                                        ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {isEditing ? (
                                    <>{saving ? "Saving..." : "Save Changes"} <Save size={14} /></>
                                ) : (
                                    <>Edit <Edit2 size={14} /></>
                                )}
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-blue/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Business Name</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-blue/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-blue/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full bg-slate-50 disabled:bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-brand-blue/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Section: Security */}
                    < div className="space-y-3 mb-6" >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Security</h3>
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
                            <MenuItem icon={Lock} label="Change Password" href="/dashboard/settings/security" />
                        </div>
                    </div >

                    {/* Section: Legal */}
                    < div className="space-y-3 mb-8" >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Legal</h3>
                        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100">
                            <MenuItem icon={FileText} label="Privacy Policy" href="/privacy" />
                            <div className="h-px bg-slate-50 mx-4" />
                            <MenuItem icon={FileText} label="Terms and Conditions" href="/terms" />
                        </div>
                    </div >

                    {/* Logout */}
                    < button
                        onClick={handleLogout}
                        className="w-full bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-bold transition-all active:scale-[0.98]"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button >

                </div >

                <BottomNav />
            </div >
        </div >
    )
}

function MenuItem({ icon: Icon, label, href }: { icon: any, label: string, href?: string }) {
    const Content = (
        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-colors">
                    <Icon size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-brand-blue transition-colors">{label}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
        </div>
    );

    return href ? <Link href={href}>{Content}</Link> : Content;
}
