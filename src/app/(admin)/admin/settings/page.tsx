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

                    {/* Data Export Section */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-lg shadow-slate-200/50">
                        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Management</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <DownloadButton type="orders" label="Export Orders CSV" />
                            <DownloadButton type="shipments" label="Export Shipments CSV" />
                        </div>
                    </div>

                    {/* Broadcast System */}
                    <BroadcastSection />

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

import { exportData } from "@/app/actions/export";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import { broadcastNotification } from "@/app/actions/notification";
import { Send, CheckCircle } from "lucide-react";

function BroadcastSection() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirm("Are you sure you want to send this to ALL users?")) {
            console.log("Broadcast cancelled by user");
            return;
        }

        setLoading(true);
        setSuccess(false);

        try {
            console.log("Broadcasting:", { title, message });
            const res = await broadcastNotification(title, message);
            console.log("Broadcast result:", res);

            if (res.success) {
                // Stop loading FIRST
                setLoading(false);

                // Then show success state
                setSuccess(true);

                // Show toast notification
                toast.success(`✅ Broadcast sent to ${res.count} users!`, {
                    duration: 3000
                });

                // Clear form after brief delay
                setTimeout(() => {
                    setTitle("");
                    setMessage("");
                }, 500);

                // Reset success state after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setLoading(false);
                toast.error("Failed to broadcast");
                console.error("Broadcast failed:", res);
            }
        } catch (error) {
            setLoading(false);
            console.error("Broadcast error:", error);
            toast.error("An error occurred");
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-lg shadow-slate-200/50">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication & Alerts</h3>
                <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">Admin Only</span>
            </div>
            <form onSubmit={handleBroadcast} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notification Title</label>
                    <input
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/10"
                        placeholder="e.g. System Maintenance"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                        required
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/10 resize-none"
                        placeholder="Type your alert message here..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !title || !message}
                    className={`w-full p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${success
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-brand-blue text-white hover:bg-blue-700'
                        }`}
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : success ? (
                        <CheckCircle size={18} />
                    ) : (
                        <Send size={18} />
                    )}
                    {success ? "Broadcast Sent!" : "Broadcast to All Users"}
                </button>
            </form>
        </div>
    );
}

// ... existing DownloadButton component ...
function DownloadButton({ type, label }: { type: 'orders' | 'shipments', label: string }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        const res = await exportData(type);
        if (res.success && res.csv) {
            // Create blob and download link
            const blob = new Blob([res.csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = res.filename || 'export.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success(`${type} exported successfully`);
        } else {
            toast.error("Export failed");
        }
        setDownloading(false);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all text-slate-700 font-bold text-sm disabled:opacity-50"
        >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {label}
        </button>
    );
}
