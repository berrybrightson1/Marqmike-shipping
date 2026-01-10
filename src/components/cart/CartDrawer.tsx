"use client";

import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useState } from "react";
// import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { createOrder } from "@/app/actions/orders";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cart, removeFromCart, clearCart, totalItems } = useCart();
    const { currency, convertPrice } = useCurrency();
    // const { user } = useUser();
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    // Helper functions for calculations
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        // 1. Create Order in Database
        const res = await createOrder({
            customerName: "Guest Cart", // user?.fullName || 
            customerPhone: phone || "Unknown", // user?.phoneNumbers?.[0]?.phoneNumber || 
            items: cart.map(item => ({
                itemName: item.name,
                quantity: item.quantity,
                priceAtTime: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                itemUrl: item.url || item.image,
                productId: item.id.toString()
            }))
        });

        // Use backend ref code
        const refCode = res.success && res.refCode ? res.refCode : `MQM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // Build message
        let message = `🛒 *New Order - ${refCode}*\n\n`;
        message += `📦 *Items:*\n`;
        cart.forEach((item, idx) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            const convertedPrice = convertPrice(price);
            message += `${idx + 1}. ${item.name}\n`;
            message += `   Qty: ${item.quantity} | Price: ${currency} ${convertedPrice.toFixed(2)}\n`;
        });
        message += `\n💰 *Total*: ${currency} ${convertPrice(getTotalPrice()).toFixed(2)}\n\n`;
        message += `📱 *Phone*: ${phone || "Not provided"}\n`;
        message += `📍 *Location*: ${location || "Not provided"}\n\n`;
        message += `🔖 *Ref Code*: ${refCode}`;

        const whatsappUrl = `https://wa.me/233551171353?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        // Clear cart after checkout
        clearCart();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={24} className="text-brand-blue" />
                            <h2 className="text-2xl font-bold text-slate-800">Your Cart</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            aria-label="Close cart"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map(item => {
                                const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                                return (
                                    <div key={item.id} className="bg-slate-50 rounded-2xl p-4 flex gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 mb-2">{item.name}</h3>
                                            <p className="text-brand-blue font-bold mb-2">
                                                {currency === "RMB" ? "¥" : currency === "GHS" ? "₵" : "$"}
                                                {convertPrice(price).toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="self-start p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Checkout Section */}
                    {cart.length > 0 && (
                        <div className="p-6 border-t border-slate-100 space-y-4">
                            {/* Quick Info */}
                            <div className="space-y-2 mb-4">
                                <input
                                    type="tel"
                                    placeholder="Phone Number (optional)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                />
                                <input
                                    type="text"
                                    placeholder="Delivery Location (optional)"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                                />
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center text-lg font-bold pb-4 border-b border-slate-100">
                                <span>Total:</span>
                                <span className="text-brand-blue text-2xl">
                                    {currency === "RMB" ? "¥" : currency === "GHS" ? "₵" : "$"}
                                    {convertPrice(getTotalPrice()).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Checkout via WhatsApp
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-colors"
                            >
                                Clear Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
