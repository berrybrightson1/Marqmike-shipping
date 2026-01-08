"use client";

import { ShoppingBag, Flame, ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

// Mock Data
const products = [
    { id: 1, name: "Transparent iPhone 15 Case", priceRMB: 12, priceGHS: 28, image: "https://placehold.co/400x400/png?text=Case", hot: true, sold: 1200 },
    { id: 2, name: "Smart Watch Ultra 2", priceRMB: 145, priceGHS: 350, image: "https://placehold.co/400x400/png?text=Watch", hot: true, sold: 850 },
    { id: 3, name: "Wireless Earbuds Pro", priceRMB: 45, priceGHS: 110, image: "https://placehold.co/400x400/png?text=Buds", hot: false, sold: 400 },
    { id: 4, name: "Portable Mini Fan", priceRMB: 18, priceGHS: 45, image: "https://placehold.co/400x400/png?text=Fan", hot: true, sold: 2100 },
    { id: 5, name: "Laptop Stand Aluminum", priceRMB: 55, priceGHS: 135, image: "https://placehold.co/400x400/png?text=Stand", hot: false, sold: 150 },
    { id: 6, name: "Led Ring Light 10\"", priceRMB: 35, priceGHS: 85, image: "https://placehold.co/400x400/png?text=Light", hot: false, sold: 320 },
];

const newArrivals = [
    { id: 101, name: "Summer Slippers", priceGHS: 45, image: "https://placehold.co/400x300/png?text=Slippers" },
    { id: 102, name: "Bluetooth Speaker", priceGHS: 120, image: "https://placehold.co/400x300/png?text=Speaker" },
    { id: 103, name: "Gaming Mouse", priceGHS: 85, image: "https://placehold.co/400x300/png?text=Mouse" },
    { id: 104, name: "Power Bank 20k", priceGHS: 150, image: "https://placehold.co/400x300/png?text=PowerBank" },
];

import { useSearchParams } from "next/navigation";

export default function ProductFeed() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery)
    );

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // ... existing scroll logic ...
        }
    };

    // Update active index on scroll
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            // ... existing handleScroll logic ...
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Hide New Arrivals if searching */}
            {!searchQuery && (
                <div className="space-y-3 relative group">
                    <div className="flex items-center gap-2 px-2">
                        <TrendingUp size={18} className="text-brand-pink" />
                        <h3 className="font-bold text-lg text-slate-800">New Arrivals</h3>
                    </div>

                    {/* Horizontal Scroll Container Wrapper */}
                    <div className="relative">
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto gap-4 px-2 pb-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {newArrivals.map((item) => (
                                <div key={item.id} className="min-w-[140px] snap-start">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative h-full group/card cursor-pointer hover:shadow-md transition-all">
                                        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold tracking-widest uppercase">New</div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-bold text-slate-700 text-xs truncate mb-1">{item.name}</h4>
                                            <p className="font-bold text-brand-pink text-xs">₵{item.priceGHS}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* View More Card */}
                            <div className="min-w-[100px] snap-start flex items-center justify-center">
                                <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-blue hover:text-white transition-colors shadow-sm">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators (Centered Below) */}
                    <div className="flex justify-center gap-1.5 pb-2">
                        {newArrivals.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-brand-pink w-4" : "bg-slate-200 w-1.5"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Main Product Grid (2 Columns) */}
            <div className="space-y-3">
                <div className="flex justify-between items-end px-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800">
                            {searchQuery ? `Search Results for "${searchQuery}"` : "Trending on 1688"}
                        </h3>
                        {!searchQuery && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Flame size={10} fill="currentColor" /> HOT
                            </span>
                        )}
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-400 font-medium">No products found.</p>
                        <button onClick={() => window.history.back()} className="text-brand-blue font-bold text-sm mt-2">Go Back</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 px-1">
                        {filteredProducts.map((product) => (
                            <Link href={`/dashboard/procurement?item=${encodeURIComponent(product.name)}`} key={product.id} className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 relative">
                                    {/* Image Area */}
                                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                        {product.hot && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 flex items-center gap-1">
                                                <Flame size={8} fill="currentColor" /> {product.sold}+ Sold
                                            </div>
                                        )}
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                                            IMG
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h4 className="font-bold text-slate-700 text-sm truncate mb-1" title={product.name}>{product.name}</h4>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 leading-none mb-0.5">From</p>
                                                <p className="font-bold text-brand-blue text-base">₵{product.priceGHS}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                                <ShoppingBag size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
