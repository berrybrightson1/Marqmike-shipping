"use client";

import { Zap, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function TrendingFeed() {
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Alibaba Mock Data
    const alibabaProducts = [
        { id: 1, name: "TWS Earbuds 5.3 Noise Cancelling", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=500", price: "2.50", moq: 50, supplier: "Shenzhen Audio Co.", verified: true, rating: "4.8", years: 5 },
        { id: 2, name: "Smart Watch Series 9 Clone", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=500", price: "8.90", moq: 20, supplier: "Guangzhou Tech", verified: true, rating: "4.5", years: 3 },
        { id: 3, name: "Portable Mini Juicer Blender", image: "https://images.unsplash.com/photo-1570222094114-28a9d88aa907?auto=format&fit=crop&q=80&w=500", price: "4.20", moq: 100, supplier: "Yiwu Home Dept", verified: false, rating: "4.2", years: 2 },
        { id: 4, name: "Men's Luxury Business Watch", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500", price: "15.00", moq: 10, supplier: "Foshan Watch Factory", verified: true, rating: "4.9", years: 8 },
        { id: 5, name: "Wireless Gaming Mouse RGB", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=500", price: "5.50", moq: 50, supplier: "Dongguan Electronics", verified: true, rating: "4.6", years: 4 },
        { id: 6, name: "Custom Logo Hoodie 360gsm", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500", price: "9.50", moq: 25, supplier: "Hangzhou Garment", verified: true, rating: "4.7", years: 6 },
    ];

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const totalScroll = scrollWidth - clientWidth;
        const progress = (scrollLeft / totalScroll) * 100;
        setScrollProgress(progress);
    };

    return (
        <section className="mb-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF6600] text-white flex items-center justify-center">
                        <Zap size={14} fill="currentColor" />
                    </div>
                    Trending on Alibaba
                </h3>
                <Link href="/dashboard/procurement" className="text-[10px] font-bold text-[#FF6600] flex items-center gap-1 hover:underline">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            {/* List */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide flex-nowrap touch-pan-x"
            >
                {alibabaProducts.map((product) => (
                    <div key={product.id} className="min-w-[260px] w-[260px] shrink-0 bg-white rounded-[20px] p-3 shadow-sm border border-slate-100 group hover:border-[#FF6600]/30 hover:shadow-lg transition-all">
                        {/* Image Badge Container */}
                        <div className="relative w-full h-32 rounded-xl bg-slate-50 overflow-hidden mb-3">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {product.verified && (
                                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold text-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Verified
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur">
                                {product.years} YRS
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-2 h-10">{product.name}</h4>

                            <div className="flex items-end justify-between mb-3">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-medium">Wholesale Price</div>
                                    <div className="text-lg font-extrabold text-[#FF6600]">{formatPrice(parseFloat(product.price), 'USD')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 font-medium">MOQ</div>
                                    <div className="text-xs font-bold text-slate-700">{product.moq} pcs</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
                                <span className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">{product.supplier}</span>
                                <button
                                    onClick={() => addToCart({
                                        id: product.id,
                                        name: product.name,
                                        price: parseFloat(product.price),
                                        image: product.image,
                                        quantity: product.moq, // Start with MOQ
                                        url: "https://alibaba.com"
                                    })}
                                    className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FF6600] transition-colors shadow-lg active:scale-95"
                                    aria-label="Add to cart"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Scroll Indicator */}
            <div className="flex justify-center mt-2">
                <div className="w-12 h-1.5 bg-slate-200/60 rounded-full overflow-hidden relative">
                    <div
                        className="absolute top-0 bottom-0 w-4 bg-[#FF6600] rounded-full transition-all duration-150 ease-out"
                        style={{
                            left: `${Math.min(70, Math.max(0, scrollProgress * 0.7))}%`
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
