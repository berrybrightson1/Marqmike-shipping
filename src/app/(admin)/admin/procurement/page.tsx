"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Search, ExternalLink, Package, Clock, CheckCircle, Truck, XCircle, MoreHorizontal, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminProcurementRequests, updateProcurementStatus } from "@/app/actions/procurement";
import { toast } from "sonner";
import Link from "next/link";

export default function ProcurementAdminPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        const res = await getAdminProcurementRequests();
        if (res.success && res.data) {
            setRequests(res.data);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const oldRequests = [...requests];

        // Optimistic update
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

        const res = await updateProcurementStatus(id, newStatus);

        if (res.success) {
            toast.success(`Marked as ${newStatus}`);
        } else {
            setRequests(oldRequests); // Revert
            toast.error("Failed to update status");
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const handleRefresh = () => {
        loadRequests();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-100 text-amber-700";
            case "Item Available": return "bg-blue-100 text-blue-700";
            case "Paid": return "bg-green-100 text-green-700";
            case "Purchased": return "bg-purple-100 text-purple-700";
            case "Shipped": return "bg-indigo-100 text-indigo-700";
            case "Arrived": return "bg-teal-100 text-teal-700";
            case "Out of Stock": return "bg-slate-200 text-slate-600";
            case "Cancelled": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
        }
    }

    const filteredRequests = requests.filter(req =>
        req.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Procurement Manager</h1>
                    <p className="text-slate-500 mt-1">Manage "Buy For Me" requests from customers.</p>
                </div>
                <button onClick={handleRefresh} title="Refresh Requests" className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-colors">
                    <CheckCircle size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </header>

            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search Requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-brand-blue/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-6">Date & Time</th>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Item Requested</th>
                                <th className="p-6">Link</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-6 text-sm text-slate-500 whitespace-nowrap">
                                        <div className="font-bold text-slate-700">{new Date(req.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-400">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{req.user?.name || "Unknown"}</span>
                                            <span className="text-xs text-slate-400">{req.user?.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-medium text-slate-800">{req.itemName}</span>
                                        {req.notes && <p className="text-xs text-slate-400 mt-1 max-w-xs">{req.notes}</p>}
                                    </td>
                                    <td className="p-6">
                                        <a href={req.itemUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-brand-blue hover:underline text-sm font-medium">
                                            View Item <ExternalLink size={14} />
                                        </a>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {req.status === "Pending" && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(req.id, "Item Available")} title="Item Available" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(req.id, "Out of Stock")} title="Out of Stock" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {req.status === "Item Available" && (
                                                <button onClick={() => handleStatusUpdate(req.id, "Paid")} title="Mark Paid" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                                                    <DollarSign size={16} />
                                                </button>
                                            )}
                                            {req.status === "Paid" && (
                                                <button onClick={() => handleStatusUpdate(req.id, "Purchased")} title="Mark Purchased" className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                                                    <DollarSignIcon />
                                                </button>
                                            )}
                                            {req.status === "Purchased" && (
                                                <button onClick={() => handleStatusUpdate(req.id, "Shipped")} title="Mark Shipped" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                                                    <Truck size={16} />
                                                </button>
                                            )}
                                            {(req.status === "Shipped" || req.status === "Purchased") && (
                                                <button onClick={() => handleStatusUpdate(req.id, "Arrived")} title="Mark Arrived" className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100">
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => handleStatusUpdate(req.id, "Cancelled")} title="Cancel" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        No requests found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function DollarSignIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    )
}
