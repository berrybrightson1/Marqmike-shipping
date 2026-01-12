"use client";

import { useState } from "react";
import { X, Link as LinkIcon, Plus, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddLinkModal({ isOpen, onClose }: AddLinkModalProps) {
    const { addToCart } = useCart();

    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(""); // User estimated price
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !name) {
            toast.error("Please provide a Link and Item Name");
            return;
        }

        addToCart({
            id: `LINK-${Date.now()}`, // Temporary ID
            name: name,
            price: price ? parseFloat(price) : 0,
            quantity: Number(quantity),
            image: "https://placehold.co/100x100?text=Link", // Placeholder
            url: url
        });

        toast.success("Link added to Cart!");
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setUrl("");
        setName("");
        setQuantity(1);
        setPrice("");
        setNote("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="bg-white p-6 rounded-[32px] shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue">
                            <LinkIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Buy for Me</h2>
                            <p className="text-slate-500 text-sm">Paste a link from 1688, Taobao, etc.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Product Link / URL</label>
                            <input
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://detail.1688.com/..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Item Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Summer Dress Red"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Quantity</label>
                                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-full py-3 text-slate-400 hover:text-brand-blue font-bold text-lg"
                                    >-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full bg-transparent text-center font-bold text-slate-800 focus:outline-none py-3"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-full py-3 text-slate-400 hover:text-brand-blue font-bold text-lg"
                                    >+</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5 tracking-wider">Est. Price (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">¥</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 transition-all mt-4"
                        >
                            <Plus size={20} />
                            Add to Cart
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
