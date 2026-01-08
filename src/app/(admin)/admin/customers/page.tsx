"use client";

import { Search, Filter, Mail, Phone, MapPin, MoreVertical, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getCustomersWithStats } from "@/app/actions/admin";

export default function AdminCustomersPage() {
    // Mock Data
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            const res = await getCustomersWithStats();
            if (res.success && res.data) {
                setCustomers(res.data);
            }
            setLoading(false);
        };
        fetchCustomers();
    }, []);

    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20 bg-[#F2F6FC]">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
                    <p className="text-slate-500 mt-1">Manage user accounts and profiles.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border text-slate-600 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2">
                        <Filter size={18} /> Filter
                    </button>
                    <button className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] transition-colors flex items-center gap-2">
                        <Mail size={18} /> Email All
                    </button>
                </div>
            </header>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search Name, Email, Phone..."
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 ring-brand-blue/20 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                                <th className="p-6">Customer</th>
                                <th className="p-6">Contact</th>
                                <th className="p-6">Type</th>
                                <th className="p-6">Stats</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center font-bold text-sm">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700">{c.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">ID: #{c.id + 4000}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Mail size={12} className="text-slate-400" /> {c.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone size={12} className="text-slate-400" /> {c.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.type === 'Business' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            c.type === 'Premium' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' :
                                                'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-slate-700">{c.spent}</div>
                                        <div className="text-xs text-slate-400">{c.orders} Orders</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all ml-auto">
                                            <MoreVertical size={16} />
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
