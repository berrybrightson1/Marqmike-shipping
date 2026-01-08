"use client";

import { useState } from "react";
import { Plus, ShoppingCart, Trash2, ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import CBMCalculator from "@/components/tools/CBMCalculator";
import { useCurrency } from "@/context/CurrencyContext";

const ALLOWED_DOMAINS = ['1688.com', 'taobao.com', 'alibaba.com', 'amazon.com', 'shein.com'];

export default function ProcurementPage() {
    const { currency, formatPrice } = useCurrency();
    const [items, setItems] = useState<any[]>([]);
    const [currentItem, setCurrentItem] = useState({ url: '', itemName: '', quantity: 1, notes: '' });
    const [error, setError] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const isValidSourceUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            return ALLOWED_DOMAINS.some(domain => hostname.includes(domain));
        } catch (e) {
            return false;
        }
    };

    const addItem = () => {
        if (!currentItem.url || !currentItem.itemName) {
            setError("Please fill in required fields.");
            return;
        }
        if (!isValidSourceUrl(currentItem.url)) {
            setError("We currently only source from approved platforms (1688, Alibaba, Amazon, Shein).");
            return;
        }

        setItems([...items, { ...currentItem, id: Date.now() }]);
        setCurrentItem({ url: '', itemName: '', quantity: 1, notes: '' });
        setError('');
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">

                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-10 shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Buy For Me</h1>
                    </div>
                    <p className="text-white/60 text-xs">Paste links from trusted sites, and we'll handle purchasing and shipping.</p>
                </div>

                {/* Form Area */}
                <div className="px-6 -mt-6 relative z-10 flex-1 flex flex-col">
                    <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 mb-6">

                        {error && (
                            <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 font-bold">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Product Link</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={currentItem.url}
                                        onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-brand-blue"
                                        placeholder="https://..."
                                    />
                                    <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Item Name</label>
                                    <input
                                        type="text"
                                        value={currentItem.itemName}
                                        onChange={(e) => setCurrentItem({ ...currentItem, itemName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-brand-blue"
                                        placeholder="e.g. Wireless Mouse"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Qty</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={currentItem.quantity}
                                        onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-brand-blue text-center"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addItem}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                Add to Request List
                            </button>
                        </div>
                    </div>

                    {/* Shipping Estimator */}
                    <div className="mb-6">
                        <CBMCalculator />
                    </div>

                    {/* List */}
                    {items.length > 0 && (
                        <div className="flex-1 space-y-3 mb-24">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Your List ({items.length})</h3>
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center animate-in slide-in-from-bottom-2">
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-brand-blue text-sm truncate">{item.itemName}</h4>
                                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.url}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-600">x{item.quantity}</span>
                                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Floating Checkout Button */}
                {items.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-40">
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full bg-brand-blue text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-blue/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                        >
                            <ShoppingCart size={20} />
                            <span>Request Quote via WhatsApp</span>
                        </button>
                    </div>
                )}

                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    cartItems={items}
                />

            </div>
        </div>
    );
}
