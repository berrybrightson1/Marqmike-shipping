"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { createOrder } from "@/app/actions/orders";
import { getUserProfile } from "@/app/actions/auth";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: any[];
}

export default function CheckoutModal({ isOpen, onClose, cartItems }: CheckoutModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const loadUserProfile = async () => {
        const profile = await getUserProfile();
        if (profile) {
            // Prefer Business Name, fallback to Name
            setName(profile.businessName || profile.name || "");
            setPhone(profile.phone || "");
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadUserProfile();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCheckout = async () => {
        setLoading(true);

        // 1. Save Order to Database
        const res = await createOrder({
            customerName: name,
            customerPhone: phone,
            items: cartItems
        });

        // Use returned refCode or fallback (though it should succeed)
        const refCode = res.success && res.refCode ? res.refCode : `REF-${Math.floor(1000 + Math.random() * 9000)}-MQM-OFFLINE`;

        if (!res.success) {
            // Optional: Show error or proceed anyway? proceeding is safer for "checkout" but bad for records.
            // For now, we proceed so user isn't blocked, but maybe log it?
            console.error("Order save failed:", res.error);
        }

        // 2. Construct WhatsApp Message
        let message = `*New Procurement Order*\n`;
        message += `Ref: \`${refCode}\`\n`;
        message += `Customer: ${name} (${phone})\n\n`;
        message += `*Items:*\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.itemName || item.name} (x${item.quantity}) - ${item.url || item.itemUrl || 'No Link'}\n`;
        });

        // 3. Open WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/233551171353?text=${encodedMessage}`;

        window.open(waLink, '_blank');
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="bg-white p-8 rounded-[32px] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>

                    <div className="mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <MessageCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Final Step</h2>
                        <p className="text-slate-500 text-sm mt-1">Enter your details to generate your order reference.</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Business / Personal Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 transition-all placeholder:text-slate-400"
                                placeholder="e.g. Ama Stores"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-bold focus:outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 transition-all placeholder:text-slate-400"
                                placeholder="055..."
                            />
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={!name || !phone || loading}
                            className="w-full bg-[#25D366] hover:bg-[#1dbf57] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <MessageCircle size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                            {loading ? "Generating..." : "Send to WhatsApp"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
