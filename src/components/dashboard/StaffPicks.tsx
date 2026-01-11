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
                            w-[180px] bg-white rounded-[24px] shadow-sm border border-slate-100
                            hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col 
                            snap-start shrink-0 overflow-hidden relative
                        ">
                            {/* Image Section */}
                            <div className="h-[180px] bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                                <img src={imageSrc} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                {item.moq && (
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur">
                                        MOQ: {item.moq}
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-2 h-10" title={item.name}>
                                    {item.name}
                                </h3>

                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-sm text-brand-blue font-black">₵{item.priceGHS?.toFixed(2)}</span>
                                        {item.priceRMB && <span className="text-[10px] text-slate-400 font-medium">¥{item.priceRMB}</span>}
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        className={`
                                            w-full h-9 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm
                                            ${count > 0
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                : 'bg-slate-900 text-white hover:bg-[#FF6600] border border-transparent'}
                                        `}
                                    >
                                        <span className="text-xs font-bold">
                                            {count > 0 ? 'Added' : 'Add to Cart'}
                                        </span>
                                        {count > 0 ? (
                                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-[10px]">✓</span>
                                            </div>
                                        ) : (
                                            <Plus size={14} strokeWidth={3} />
                                        )}
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
