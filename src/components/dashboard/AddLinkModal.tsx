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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0049AD]/20 backdrop-blur-md" onClick={onClose}>
            <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl relative border border-white/40" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/50 hover:bg-white transition-colors flex items-center justify-center text-slate-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-brand-blue to-brand-pink rounded-[24px] rotate-3 flex items-center justify-center text-white shadow-xl shadow-brand-blue/20 mx-auto mb-6 transform hover:rotate-6 transition-transform duration-500">
                            <LinkIcon size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Buy for Me</h2>
                        <p className="text-slate-500 font-medium text-sm">Paste a link from 1688, Taobao, or Tmall</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="text-xs uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Product Link</label>
                            <input
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:border-brand-blue transition-all font-mono text-sm shadow-sm group-hover:shadow-md"
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Item Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="What is this item?"
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:border-brand-pink transition-all shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Qty</label>
                                <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl px-2 h-[58px] shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-blue font-bold text-xl active:scale-90 transition-transform"
                                    >-</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full bg-transparent text-center font-bold text-slate-800 focus:outline-none text-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-brand-blue font-bold text-xl active:scale-90 transition-transform"
                                    >+</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase font-bold text-slate-400 block mb-2 tracking-widest pl-2">Est. Price</label>
                                <div className="relative h-[58px]">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</div>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 text-slate-800 font-bold focus:outline-none focus:border-brand-blue transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-brand-blue to-brand-blue hover:to-brand-pink text-white rounded-2xl font-bold shadow-xl shadow-brand-blue/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 bg-[length:200%_auto] hover:bg-right"
                        >
                            <Plus size={24} />
                            <span className="text-lg">Add to Cart</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
