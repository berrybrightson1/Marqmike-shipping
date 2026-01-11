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
                flex gap-4
                overflow-x-auto pb-4 px-1
                no-scrollbar snap-x
                touch-pan-x
            ">
                {products.map((item) => {
                    const count = getItemCount(item.id);
                    const imageSrc = item.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`;

                    return (
                        <div key={item.id} className="
                            w-[180px] bg-white rounded-[16px] border border-slate-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                            hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group flex flex-col 
                            snap-start shrink-0 overflow-hidden relative
                        ">
                            {/* Image Section - Full Bleed */}
                            <div className="h-[180px] w-full bg-white relative overflow-hidden">
                                <img src={imageSrc} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {item.moq && (
                                    <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                                        MOQ: {item.moq}
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-3 flex flex-col flex-1 bg-white">
                                <h3 className="text-[13px] font-medium text-slate-700 leading-snug line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-brand-blue transition-colors" title={item.name}>
                                    {item.name}
                                </h3>

                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[10px] text-slate-400 font-bold">GHS</span>
                                        <span className="text-lg font-bold text-slate-900 tracking-tight">{item.priceGHS?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        className={`
                                            w-full h-8 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95
                                            ${count > 0
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-slate-900 text-white hover:bg-brand-blue shadow-md shadow-slate-200'}
                                        `}
                                    >
                                        <span className="text-[11px] font-bold">
                                            {count > 0 ? 'Added' : 'Add to Cart'}
                                        </span>
                                        {count > 0 && <span className="text-[10px]">✓</span>}
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
