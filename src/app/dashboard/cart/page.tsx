"use client";

import { useCart } from "@/context/CartContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Trash2, ArrowRight, ShoppingBag, MessageCircle, ShoppingCart, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { useState } from "react";

export default function CartPage() {
    const { cart, removeFromCart, clearCart, totalItems } = useCart();

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
            return total + price * item.quantity;
        }, 0);
    };

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    const handleCheckoutTrigger = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }
        setIsCheckoutOpen(true);
    };

    const handleCheckoutComplete = () => {
        setCheckoutSuccess(true);
        clearCart();
    };

    if (checkoutSuccess) {
        return (
            <div className="min-h-screen bg-[#F2F6FC] pb-24 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Order Submitted!</h1>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    We've opened WhatsApp for you to send the order details. An admin will confirm shortly.
                </p>
                <div className="space-y-3 w-full max-w-xs">
                    <Link href="/dashboard/shipments" className="block w-full py-3.5 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20">
                        View My Requests
                    </Link>
                    <Link href="/dashboard/shop" className="block w-full py-3.5 bg-white text-slate-600 rounded-xl font-bold border border-slate-200">
                        Continue Shopping
                    </Link>
                    <button onClick={() => setCheckoutSuccess(false)} className="text-sm text-slate-400 font-bold mt-4">
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header Mock */}
            <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg mb-6 relative">
                <Link href="/dashboard" className="absolute top-12 left-6 text-white/80 hover:text-white transition-colors">
                    <ArrowRight className="rotate-180" size={24} />
                </Link>
                <h1 className="text-2xl text-white font-bold text-center">My Cart ({totalItems})</h1>
            </div>

            <div className="px-6 max-w-lg mx-auto space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
                        <p className="text-slate-400 text-sm mb-8">Looks like you haven't added anything yet.</p>
                        <Link href="/dashboard/shop" className="bg-brand-blue text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:bg-brand-blue/90 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
                                        <p className="text-brand-pink font-bold text-xs">${item.price}</p>
                                        <p className="text-slate-400 text-[10px]">Qty: {item.quantity}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500 text-sm">Estimated Total</span>
                                <span className="text-2xl font-bold text-slate-800">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckoutTrigger}
                                className="w-full py-4 bg-brand-blue/5 text-brand-blue border-2 border-brand-blue rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white transition-all"
                            >
                                <ShoppingCart size={20} />
                                Notify Admin via WhatsApp
                            </button>
                            <p className="text-center text-slate-400 text-xs mt-4">
                                Your items are already saved. Click above if you want to speed up the process.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cartItems={cart.map(item => ({
                    ...item,
                    itemName: item.name, // Map for API
                    itemUrl: item.url
                }))}
                onCheckoutComplete={handleCheckoutComplete}
            />
        </div>
    );
}
