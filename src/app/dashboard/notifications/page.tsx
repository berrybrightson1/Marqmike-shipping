"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Bell, Package, Tag, Info, CheckCircle2, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNotifications, markAllNotificationsRead } from "@/app/actions/notification";
import { toast } from "sonner";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredNotifications(notifications);
            return;
        }
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = notifications.filter(n =>
            n.title?.toLowerCase().includes(lowerQuery) ||
            n.message?.toLowerCase().includes(lowerQuery)
        );
        setFilteredNotifications(filtered);
    }, [searchQuery, notifications]);

    const loadNotifications = async () => {
        const res = await getUserNotifications();
        if (res.success) {
            setNotifications(res.data);
            setFilteredNotifications(res.data);
        }
        setLoading(false);
    };

    const handleMarkAllRead = async () => {
        const res = await markAllNotificationsRead();
        if (res.success) {
            toast.success("All marked as read");
            loadNotifications();
        } else {
            toast.error("Failed to update");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'shipment': return Package;
            case 'promo': return Tag;
            case 'success': return CheckCircle2;
            case 'system': return Info;
            default: return Bell;
        }
    };

    const getIconStyle = (type: string) => {
        switch (type) {
            case 'shipment': return 'bg-blue-50 text-brand-blue';
            case 'promo': return 'bg-purple-50 text-purple-600';
            case 'success': return 'bg-green-50 text-green-600';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            <DashboardHeader title="Notifications" showBack={true} backLink="/dashboard" />

            <div className="px-6 -mt-16 relative z-10 max-w-2xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200 mb-6 flex flex-col gap-4 relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
                            <p className="text-slate-500 text-xs">Manage your alerts</p>
                        </div>

                        <div className="flex gap-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to clear all notifications?")) {
                                            const { clearAllNotifications } = await import("@/app/actions/cleanup");
                                            const res = await clearAllNotifications();
                                            if (res.success) {
                                                toast.success("Notifications cleared");
                                                loadNotifications();
                                            } else {
                                                toast.error("Failed to clear");
                                            }
                                        }
                                    }}
                                    className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 size={14} /> Clear All
                                </button>
                            )}

                            {notifications.some(n => !n.read) && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1.5"
                                >
                                    <CheckCircle2 size={14} /> Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                </div>

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-slate-400 text-xs">Loading updates...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-[32px] p-12 text-center shadow-lg shadow-slate-100">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-slate-300" />
                            </div>
                            <h3 className="font-bold text-slate-700">No results found</h3>
                            <p className="text-slate-400 text-xs mt-1">Try a different search term.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => {
                            const Icon = getIcon(notif.type);
                            return (
                                <div
                                    key={notif.id}
                                    className={`
                                        bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex gap-5 group transition-all duration-300
                                        ${!notif.read ? 'shadow-md ring-1 ring-brand-blue/10' : 'hover:shadow-md'}
                                    `}
                                >
                                    {/* Icon Column */}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconStyle(notif.type)}`}>
                                        <Icon size={20} />
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-base truncate pr-2 ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg shrink-0">
                                                {getRelativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-3">
                                            {notif.message}
                                        </p>

                                        {/* Action Bar (Mock) */}
                                        <div className="flex gap-2">
                                            {notif.type === 'shipment' && (
                                                <button className="text-[10px] font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                                    Track Package
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    {!notif.read && (
                                        <div className="shrink-0 pt-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
