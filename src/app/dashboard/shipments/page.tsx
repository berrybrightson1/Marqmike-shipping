"use client";

import { useState } from "react";
import { Search, Package, ArrowLeft, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

// Mock Data - In real app, fetch from API similar to procurement requests
const MOCK_SHIPMENTS = [
    { id: '1', trackingId: 'MQM-8822-192', item: 'iPhone 15 Pro Max', status: 'In Transit', date: '2026-01-10' },
    { id: '2', trackingId: 'MQM-8822-384', item: 'Nike Air Jordan', status: 'Delivered', date: '2026-01-08' },
    { id: '3', trackingId: 'MQM-8822-551', item: 'MacBook Pro M3', status: 'Processing', date: '2026-01-11' },
];

export default function ShipmentsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Tracking ID copied!");
    };

    const filtered = MOCK_SHIPMENTS.filter(s =>
        s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F2F6FC] p-6 pb-24">
            <header className="mb-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 transition-transform active:scale-95">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Tracking IDs</h1>
            </header>

            {/* Search */}
            <div className="bg-white p-2 pl-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center mb-8 focus-within:ring-2 ring-brand-blue/20 transition-all">
                <Search className="text-slate-400 shrink-0" size={20} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tracking ID or item..."
                    className="w-full py-3 bg-transparent border-none outline-none text-slate-700 font-bold placeholder:font-medium placeholder:text-slate-400"
                />
            </div>

            {/* List */}
            <div className="space-y-4">
                {filtered.map((shipment) => (
                    <div key={shipment.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{shipment.item}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold">{shipment.date}</span>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${shipment.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                    shipment.status === 'In Transit' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-orange-50 text-orange-600 border-orange-100'
                                }`}>
                                {shipment.status}
                            </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between group border border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tracking ID</span>
                                <span className="font-mono font-bold text-slate-700 select-all">{shipment.trackingId}</span>
                            </div>
                            <button
                                onClick={() => handleCopy(shipment.trackingId)}
                                className="p-2 bg-white rounded-lg text-slate-400 hover:text-brand-blue hover:shadow-sm transition-all border border-slate-200"
                                title="Copy Tracking ID"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
