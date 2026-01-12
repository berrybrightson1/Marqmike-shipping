"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, MapPin, Phone } from "lucide-react";
// import { useUser } from "@clerk/nextjs"; 
import { toast } from "sonner";
import { getUserProfile } from "@/app/actions/auth";

import { createOrder } from "@/app/actions/orders";

interface WhatsAppCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        name: string;
        priceRMB: number;
    };
    quantity: number;
    totalCBM: number;
}

export default function WhatsAppCheckoutModal({ isOpen, onClose, product, quantity, totalCBM }: WhatsAppCheckoutModalProps) {
    // const { user } = useUser();
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    // Load User Profile to pre-fill
    useEffect(() => {
        if (isOpen) {
            const loadProfile = async () => {
                const profile = await getUserProfile();
                if (profile) {
                    setPhone(profile.phone || "");
                    setName(profile.businessName || profile.name || "");
                }
            };
            loadProfile();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCheckout = async () => {
        if (!phone || !location) {
            toast.error("Please fill in all fields");
            return;
        }

        // 1. Create Order in Database
        const res = await createOrder({
            customerName: name || "Guest (Buy Now)",
            customerPhone: phone,
            items: [{
                itemName: product.name,
                quantity: quantity,
                priceAtTime: product.priceRMB,
                productId: product.id
            }]
        });

        // Use backend ref code if successful, else fallback
        const refCode = res.success && res.refCode ? res.refCode : `MQM-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        // Construct WhatsApp Message
        const message = encodeURIComponent(
            `🛒 *New Order Request*\n\n` +
            `👤 Customer: ${name || "Guest"}\n` +
            `📦 Product: ${product.name}\n` +
            `🔢 Quantity: ${quantity}\n` +
            `💰 Price: ¥${product.priceRMB} x ${quantity} = ¥${product.priceRMB * quantity}\n` +
            `📐 Total CBM: ${totalCBM}\n\n` +
            `📍 Delivery: ${location}\n` +
            `📞 Phone: ${phone}\n\n` +
            `🔖 Ref: ${refCode}`
        );

        const whatsappUrl = `https://wa.me/233551171353?text=${message}`;
        window.open(whatsappUrl, "_blank");

        toast.success("Opening WhatsApp...", {
            description: `Your reference code is ${refCode}`
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="bg-white w-full md:max-w-lg md:rounded-[32px] rounded-t-[32px] p-8 relative animate-in slide-in-from-bottom md:slide-in-from-bottom-0">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Close checkout"
                >
                    <X size={20} className="text-slate-400" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Finalize Order</h2>
                    <p className="text-slate-500 text-sm">We'll send your request via WhatsApp</p>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <Phone size={14} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+233 24 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={14} />
                            Delivery Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Accra, Tema, Kumasi"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-600">Product:</span>
                        <span className="font-bold text-slate-800">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">Quantity:</span>
                        <span className="font-bold text-slate-800">{quantity}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-600">Total:</span>
                        <span className="font-bold text-brand-blue text-base">¥{product.priceRMB * quantity}</span>
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-green-500/30 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                    <MessageCircle size={20} />
                    Continue on WhatsApp
                </button>
            </div>
        </div>
    );
}
