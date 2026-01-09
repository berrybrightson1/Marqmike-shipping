"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, ExternalLink, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProcurementRequests } from "@/app/actions/admin";

export default function AdminProcurementPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            const res = await getProcurementRequests();
            if (res.success && res.data) {
                setRequests(res.data.map((r: any) => ({
                    id: r.id,
                    user: r.user?.email || "Unknown",
                    item: r.itemName,
                    url: r.itemUrl,
                    status: r.status,
                    date: new Date(r.createdAt).toLocaleDateString()
                })));
            }
            setLoading(false);
        };
        fetchRequests();
    }, []);

    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20 bg-[#F2F6FC]">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Procurement</h1>
                    <p className="text-slate-500 mt-1">Manage "Buy For Me" requests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border text-slate-600 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </header>

            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                                <th className="p-6">Request</th>
                                <th className="p-6">User</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-slate-800 text-sm">{req.item}</div>
                                        <a href="#" className="text-[10px] font-bold text-brand-blue flex items-center gap-1 hover:underline mt-1 bg-brand-blue/5 w-fit px-2 py-0.5 rounded-md">
                                            <ExternalLink size={10} /> View Source
                                        </a>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {req.user.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700 text-sm">{req.user}</div>
                                                <div className="text-[10px] text-slate-400">{req.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="text-xs font-bold text-slate-500 hover:text-brand-blue px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "Approved") return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={12} /> Approved</span>;
    if (status === "In Review") return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> In Review</span>;
    return <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
}
