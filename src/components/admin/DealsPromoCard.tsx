"use client";

import { Tag, Plus, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DealsPromoCard() {
    const [promos, setPromos] = useState([
        { id: 1, code: "WELCOME20", discount: "20% OFF", status: "Active" },
        { id: 2, code: "SHIPFREE", discount: "Free Shipping", status: "Active" }
    ]);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Promo code copied!");
    };

    const handleDelete = (id: number) => {
        setPromos(prev => prev.filter(p => p.id !== id));
        toast.success("Promo deleted");
    };

    const handleAdd = () => {
        const newCode = `PROMO${Math.floor(Math.random() * 1000)}`;
        setPromos([...promos, { id: Date.now(), code: newCode, discount: "10% OFF", status: "Active" }]);
        toast.success("New promo generated");
    };

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-brand-blue/5 border border-white/50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Deals & Promos</h3>
                    <p className="text-slate-500 text-xs">Manage active discount codes</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center hover:bg-brand-pink/90 transition-colors shadow-lg shadow-brand-pink/20"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[250px]">
                {promos.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No active promos</div>
                ) : (
                    promos.map(promo => (
                        <div key={promo.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-brand-blue/20 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <Tag size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{promo.code}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{promo.discount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleCopy(promo.code)}
                                    className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                                    title="Copy Code"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(promo.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Active Campaigns</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">{promos.length} Live</span>
                </div>
            </div>
        </div>
    );
}
