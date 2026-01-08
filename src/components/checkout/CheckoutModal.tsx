"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: any[];
}

export default function CheckoutModal({ isOpen, onClose, cartItems }: CheckoutModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const generateRef = () => {
        const random = Math.floor(1000 + Math.random() * 9000);
        return `REF-${random}-MQM`;
    };

    const handleCheckout = () => {
        setLoading(true);
        const refCode = generateRef();

        // Construct Message
        let message = `*New Procurement Order*\n`;
        message += `Ref: \`${refCode}\`\n`;
        message += `Customer: ${name} (${phone})\n\n`;
        message += `*Items:*\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.itemName} (x${item.quantity}) - ${item.url}\n`;
        });

        // Encode and Redirect
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/233551171353?text=${encodedMessage}`;

        // Simulate a small delay for UX
        setTimeout(() => {
            window.open(waLink, '_blank');
            setLoading(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
                <GlassCard className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-bold text-white mb-2">Final Step</h2>
                    <p className="text-white/60 text-sm mb-6">Enter your details to generate your order reference.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Business / Personal Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                                placeholder="e.g. Ama Stores"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-pink/50 transition-colors"
                                placeholder="055..."
                            />
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={!name || !phone || loading}
                            className="w-full bg-[#25D366] hover:bg-[#1dbf57] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MessageCircle size={20} fill="currentColor" />
                            {loading ? "Generating..." : "Send to WhatsApp"}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
