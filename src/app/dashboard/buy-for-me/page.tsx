"use client";

import { useState } from "react";
import { Link as LinkIcon, Plus, Info, ArrowLeft, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function BuyForMePage() {
    const { addToCart } = useCart();
    const router = useRouter();

    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("RMB"); // Default to RMB for China shopping

    const CURRENCIES = ["RMB", "USD", "GHS", "NGN"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !name) {
            toast.error("Please provide a product link and name");
            return;
        }

        // Add to cart with note about currency if needed
        addToCart({
            id: `LINK-${Date.now()}`,
            name: name,
            price: price ? parseFloat(price) : 0,
            quantity: Number(quantity),
            image: "https://placehold.co/100x100?text=Link",
            url: url,
            // You might want to pass currency in a real app, storing in 'ref' or similar for now
            // For now, we assume the price logic handles simple numbers, but we'll append currency to name or handle it via a note if supported
        });

        toast.success("Added to Cart!", {
            description: "Detailed request saved."
        });

        // Redirect back to dashboard or cart? Let's stay here or go to cart.
        // Usually better to let them add more or go to cart.
        resetForm();
    };

    const resetForm = () => {
        setUrl("");
        setName("");
        setQuantity(1);
        setPrice("");
        setCurrency("RMB");
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-brand-blue rounded-b-[40px] z-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute top-10 left-10 w-40 h-40 bg-brand-pink/20 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 px-6 pt-8 max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} aria-label="Go back" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Buy for Me</h1>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-brand-blue/10 p-6 md:p-8 border border-white/50 relative overflow-hidden">
                    {/* Decorative Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-brand-blue to-brand-pink rounded-[24px] rotate-3 flex items-center justify-center text-white shadow-xl shadow-brand-blue/20 mb-4 transform group-hover:rotate-6 transition-all duration-500">
                            <LinkIcon size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 text-center">Paste Product Link</h2>
                        <p className="text-slate-400 text-sm text-center max-w-[200px]">
                            We handle the purchasing, inspection, and shipping for you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* URL Input */}
                        <div className="group">
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Product Link</label>
                            <input
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://detail.1688.com/..."
                                className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-brand-blue rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:border-brand-blue transition-all font-mono text-sm shadow-sm"
                            />
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Item Name / Description</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Red Summer Dress Size M"
                                className="w-full bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-brand-pink rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:border-brand-pink transition-all shadow-sm"
                            />
                        </div>

                        {/* Qty & Price Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Quantity */}
                            <div>
                                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Quantity</label>
                                <div className="flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl px-1 h-[58px] hover:bg-white transition-colors">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        aria-label="Decrease quantity"
                                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-blue font-bold text-xl active:scale-95 transition-transform"
                                    >-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        aria-label="Quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full bg-transparent text-center font-bold text-slate-800 focus:outline-none text-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        aria-label="Increase quantity"
                                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-blue font-bold text-xl active:scale-95 transition-transform"
                                    >+</button>
                                </div>
                            </div>

                            {/* Price with Currency Select */}
                            <div>
                                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Est. Unit Price</label>
                                <div className="flex bg-slate-50 border-2 border-slate-100 rounded-2xl h-[58px] overflow-hidden hover:bg-white transition-colors focus-within:border-brand-blue focus-within:ring-0">
                                    <select
                                        aria-label="Select Currency"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="bg-transparent pl-3 text-xs font-bold text-slate-500 border-none outline-none focus:ring-0 cursor-pointer appearance-none hover:text-brand-blue transition-colors"
                                    >
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-transparent px-2 text-right font-bold text-slate-800 focus:outline-none placeholder:text-slate-300"
                                    />
                                    <span className="pr-3 flex items-center justify-center text-slate-400 font-medium text-xs pointer-events-none">
                                        {/* Spacer */}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-brand-blue to-brand-blue hover:to-brand-pink text-white rounded-2xl font-bold shadow-xl shadow-brand-blue/30 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] bg-[length:200%_auto] hover:bg-right mt-4"
                        >
                            <Plus size={24} />
                            <span className="text-lg">Add Request to Cart</span>
                        </button>

                        <p className="text-center text-[10px] text-slate-400 font-bold px-4">
                            Items will be reviewed by our team before purchase processing confirms final costs.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
