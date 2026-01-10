"use client";

import { ShieldCheck, Plus, Star, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getInventory } from "@/app/actions/product";

export default function StaffPicks() {
    const { addToCart, cart } = useCart();
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await getInventory();
            if (res.success && res.data) {
                setProducts(res.data);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (e: React.MouseEvent, item: any) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: item.id,
            name: item.name,
            price: item.priceGHS || (item.priceRMB * 2.2), // Fallback calculation if GHS missing
            image: item.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`,
            quantity: 1
        });
        toast.success("Added to cart");
    };

    // Helper to get quanity of item in cart
    const getItemCount = (id: string) => {
        const cartItem = cart.find(i => i.id === id);
        return cartItem ? cartItem.quantity : 0;
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        )
    }

    if (products.length === 0) {
        return null; // Don't show section if empty
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Staff Picks</h2>
                        <p className="text-xs text-slate-500 font-medium">Verified essentials for your business</p>
                    </div>
                </div>
            </div>

            {/* Single Row Horizontal Scroll Container for Staff Picks */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                flex gap-5
                overflow-x-auto pb-4 px-1
                no-scrollbar snap-x
            " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {products.map((item) => {
                    const count = getItemCount(item.id);
                    const imageSrc = item.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`;

                    return (
                        <div key={item.id} className="
                            w-48 bg-white rounded-[20px] shadow-sm border border-slate-100
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col 
                            snap-start shrink-0 overflow-hidden
                        ">
                            {/* Image Section */}
                            <div className="h-40 bg-[#F4F5F7] p-4 flex items-center justify-center relative">
                                <img src={imageSrc} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>

                            {/* Content Section */}
                            <div className="p-3 flex flex-col flex-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    {item.category || "General"}
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2 min-h-[2.5em]" title={item.name}>
                                    {item.name}
                                </h3>
                                <div className="mb-2">
                                    <span className="text-sm font-bold text-slate-900">₵{item.priceGHS?.toFixed(2)}</span>
                                    {item.priceRMB && <span className="text-[10px] text-slate-400 ml-1">(¥{item.priceRMB})</span>}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        className={`
                                            w-full py-2.5 rounded-xl flex items-center justify-between px-4 transition-all duration-300 active:scale-95
                                            ${count > 0 ? 'bg-green-500 text-white' : 'bg-[#EA580C] text-white hover:bg-[#d94e06]'}
                                        `}
                                    >
                                        <span className="text-[10px] font-bold">
                                            {count > 0 ? `${count} Added` : 'Add to Cart'}
                                        </span>
                                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                            {count > 0 ? <span className="text-[8px]">✓</span> : <Plus size={10} />}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Slider Indicator */}
            {products.length > 2 && (
                <div className="flex justify-center mt-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden bg-slate-100">
                        <div
                            className="h-full bg-brand-blue rounded-full transition-all duration-100"
                            style={{ width: '30%', transform: `translateX(${scrollProgress * 0.7}%)` }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
