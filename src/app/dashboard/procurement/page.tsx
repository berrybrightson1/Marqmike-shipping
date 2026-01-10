"use client";

import { useState, useEffect } from "react";
import { Plus, ShoppingCart, Trash2, ArrowLeft, Link2, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CBMCalculator from "@/components/tools/CBMCalculator";
import { createProcurementRequest, getUserProcurementRequests } from "@/app/actions/procurement";
import { toast } from "sonner";
import CheckoutModal from "@/components/checkout/CheckoutModal";

const ALLOWED_DOMAINS = ['1688.com', 'taobao.com', 'alibaba.com', 'amazon.com', 'shein.com'];

export default function ProcurementPage() {
    // Form State
    const [currentItem, setCurrentItem] = useState({ itemUrl: '', itemName: '', quantity: 1, notes: '' });
    const [loading, setLoading] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Data State
    const [requests, setRequests] = useState<any[]>([]);

    const searchParams = useSearchParams();

    useEffect(() => {
        // Auto-fill form if URL params exist
        const item = searchParams.get('item');
        const url = searchParams.get('url');
        const price = searchParams.get('price');

        if (item || url) {
            setCurrentItem(prev => ({
                ...prev,
                itemName: item || '',
                itemUrl: url || '',
                quantity: 1
            }));
        }

        loadRequests();
    }, [searchParams]);

    const loadRequests = async () => {
        const res = await getUserProcurementRequests();
        setRequests(res.data || []);
    };

    const handleSubmit = async () => {
        if (!currentItem.itemUrl || !currentItem.itemName) {
            toast.error("Please fill in required fields.");
            return;
        }

        setLoading(true);
        const res = await createProcurementRequest(currentItem);
        setLoading(false);

        if (res.success) {
            toast.success("Request submitted successfully!");
            setCurrentItem({ itemUrl: '', itemName: '', quantity: 1, notes: '' });
            loadRequests();
        } else {
            toast.error("Failed to submit request.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">

                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-10 shrink-0 shadow-xl shadow-brand-blue/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Buy For Me</h1>
                    </div>
                    <p className="text-white/60 text-xs">Paste links from trusted sites, and we'll handle purchasing and shipping.</p>
                </div>

                {/* Content Area */}
                <div className="px-6 -mt-6 relative z-10 flex-1 flex flex-col space-y-6">

                    {/* Input Form */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Product Link</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={currentItem.itemUrl}
                                        onChange={(e) => setCurrentItem({ ...currentItem, itemUrl: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue placeholder:text-slate-500"
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue placeholder:text-slate-500"
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue text-center placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-brand-pink text-white font-bold text-xs shadow-lg shadow-brand-pink/30 hover:bg-[#e0007d] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </div>



                    {/* Request History */}
                    <div className="flex-1 pb-10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">Your Requests</h3>

                        {requests.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs">
                                No requests yet. Start by adding an item above!
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group">
                                        <div className="overflow-hidden mr-4">
                                            <h4 className="font-bold text-brand-blue text-sm truncate">{item.itemName}</h4>
                                            <a href={item.itemUrl} target="_blank" className="text-[10px] text-brand-blue/60 truncate hover:underline flex items-center gap-1">
                                                View Link <ExternalLink size={10} />
                                            </a>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                item.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Notify Admin Button (Inline) */}
                        {requests.length > 0 && (
                            <div className="mt-8 px-4">
                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-blue/10 transition-colors"
                                >
                                    <ShoppingCart size={18} />
                                    <span>Notify Admin via WhatsApp</span>
                                </button>
                                <p className="text-center text-[10px] text-slate-400 mt-2">
                                    Your items are already saved. Click above if you want to speed up the process.
                                </p>
                            </div>
                        )}
                    </div>

                    <CheckoutModal
                        isOpen={isCheckoutOpen}
                        onClose={() => setIsCheckoutOpen(false)}
                        cartItems={requests.map(r => ({ ...r, id: r.id, quantity: 1 }))}
                    />

                </div>
            </div>
        </div>
    );
}
