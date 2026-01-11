"use client";

import { DollarSign, Package, Users, Activity, ArrowUpRight, Loader2, ShoppingCart, UserPlus, Truck, ClipboardList, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminStats, getRecentAuditLogs } from "@/app/actions/admin";
import AdminCharts from "@/components/admin/AdminCharts";

import DealsPromoCard from "@/components/admin/DealsPromoCard";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [statsRes, logsRes] = await Promise.all([
                getAdminStats(),
                getRecentAuditLogs()
            ]);

            if (statsRes.success && statsRes.data) setStats(statsRes.data);
            if (logsRes.success && logsRes.data) setLogs(logsRes.data);

            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-brand-blue" /></div>;
    }

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
                    <p className="text-slate-500 font-medium">System Performance & Activities</p>
                </div>
                <div className="flex gap-3">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-100 shadow-sm">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        System Operational
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* LEFT COLUMN (Stats + Actions) */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8">

                    {/* 1. Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Daily Work Load"
                            value={logs.filter((l: any) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length || 0}
                            change="Actions Today"
                            icon={Activity}
                            color="bg-brand-pink"
                        />
                        <StatCard title="Active Shipments" value={stats?.activeShipments || 0} change="In Transit" icon={Package} color="bg-brand-blue" />
                        <StatCard title="Total Customers" value={stats?.totalCustomers || 0} change="Registered" icon={Users} color="bg-purple-500" />
                        <StatCard title="Pending Requests" value={stats?.pendingRequests || 0} change="Action Needed" icon={ClipboardList} color="bg-orange-500" />
                    </div>

                    {/* 2. Quick Actions */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-brand-blue/5 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <button className="h-32 rounded-[24px] bg-brand-blue/5 border border-brand-blue/10 flex flex-col items-center justify-center gap-3 hover:bg-brand-blue/10 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
                                    <Package size={22} />
                                </div>
                                <span className="font-bold text-brand-blue text-sm">New Shipment</span>
                            </button>
                            <button className="h-32 rounded-[24px] bg-orange-50 border border-orange-100 flex flex-col items-center justify-center gap-3 hover:bg-orange-100 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                    <Activity size={22} />
                                </div>
                                <span className="font-bold text-orange-600 text-sm">Pending Issues</span>
                            </button>
                            <a href="/admin/inventory/trending" className="h-32 rounded-[24px] bg-purple-50 border border-purple-100 flex flex-col items-center justify-center gap-3 hover:bg-purple-100 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                    <ArrowUpRight size={22} />
                                </div>
                                <span className="font-bold text-purple-600 text-sm">Trending Inventory</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Audit Logs) */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                    <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-brand-blue/5 border border-slate-100 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={20} className="text-slate-400" />
                                <h3 className="text-lg font-bold text-slate-800">Audit Log</h3>
                            </div>
                            <a href="/admin/audit" className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">View All</a>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 max-h-[600px] lg:max-h-none">
                            {logs.length > 0 ? logs.map((log: any) => {
                                let Icon = Activity;
                                if (log.entityType === 'ORDER') Icon = ShoppingCart;
                                else if (log.entityType === 'SHIPMENT') Icon = Truck;
                                else if (log.entityType === 'USER') Icon = UserPlus;
                                else if (log.entityType === 'PROCUREMENT') Icon = ClipboardList;
                                else if (log.desc && log.desc.includes("Failed")) Icon = ShieldAlert;

                                return (
                                    <ActivityItem
                                        key={log.id}
                                        title={log.title}
                                        desc={log.desc}
                                        time={new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        icon={Icon}
                                        entityType={log.entityType}
                                    />
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <ClipboardList size={32} className="mb-2 opacity-50" />
                                    <span className="text-sm font-medium">No recent activity</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                    {change} <ArrowUpRight size={12} />
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wide">{title}</p>
                <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
            </div>
        </div>
    )
}

function ActivityItem({ title, desc, time, icon: Icon, entityType }: any) {
    // Dynamic color based on entity type?
    const colorClass = entityType === 'ORDER' ? 'group-hover:bg-green-500' :
        entityType === 'SHIPMENT' ? 'group-hover:bg-brand-blue' :
            entityType === 'USER' ? 'group-hover:bg-[#ff1493]' :
                'group-hover:bg-slate-700';

    return (
        <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
            <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 ${colorClass} group-hover:text-white transition-colors`}>
                <Icon size={18} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-700">{title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1" title={desc}>{desc}</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{time}</span>
        </div>
    )
}
