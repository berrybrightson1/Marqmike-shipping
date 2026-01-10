"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Plus, Upload, DollarSign, Package, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getInventory } from "@/app/actions/product";
import Link from "next/link";

export default function InventoryManagerPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            const res = await getInventory();
            if (res.success && res.data) {
                setInventory(res.data);
            }
            setLoading(false);
        };
        fetchInventory();
    }, []);

    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Inventory Manager</h1>
                    <p className="text-slate-500 mt-1">Creator Studio: Upload and manage products.</p>
                </div>
                <Link href="/admin/inventory/new" className="bg-brand-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] transition-colors flex items-center gap-2">
                    <Plus size={18} /> Add New Product
                </Link>
            </header>

            {/* Upload Area (Creator Studio) */}
            <Link href="/admin/inventory/new">
                <GlassCard className="p-8 mb-8 border-dashed border-2 border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Drop product images here</h3>
                        <p className="text-slate-400 text-sm mt-1">or click to upload to Global Store</p>
                    </div>
                </GlassCard>
            </Link>

            {/* Inventory List */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search Inventory..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-brand-blue/20 outline-none"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-6">Product</th>
                            <th className="p-6">Pricing (RMB / GHS)</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {inventory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200">
                                            <img
                                                src={item.imageUrl || `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(item.name.substring(0, 2))}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-slate-700">{item.name}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">¥{item.priceRMB}</span>
                                        <span className="text-xs text-slate-400">₵{item.priceGHS}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${item.status === "Ready in Ghana"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}>
                                        <Package size={12} />
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right font-mono font-bold text-slate-600">
                                    {item.stock}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
