"use client";

import { useTrendingFeed } from "@/hooks/useTrendingFeed";

import { Flame, ExternalLink, TrendingUp, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useRef, useState } from "react";

export default function TrendingFeed() {
    const { data: products, loading } = useTrendingFeed();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    if (loading) {
        return (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500">
                        <Flame size={16} fill="currentColor" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Trending on 1688</h2>
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-48 h-64 bg-slate-100 rounded-xl animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="mb-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <Flame size={16} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">Trending on 1688</h2>
                        <p className="text-xs text-slate-500 font-medium">Live hot picks from verified suppliers</p>
                    </div>
                </div>

                <Link href="#" className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            {/* 2-Row Grid Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                grid grid-rows-2 grid-flow-col gap-4
                overflow-x-auto pb-4
                custom-scrollbar snap-x
                auto-cols-[max-content] 
            ">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/dashboard/procurement?item=${encodeURIComponent(product.title)}&url=${encodeURIComponent(product.url)}&price=${product.price.amount}&currency=${product.price.currency}`}
                        className="
                            w-72 h-40 bg-white rounded-[20px] border border-slate-100 p-4
                            flex gap-4 hover:shadow-xl hover:shadow-slate-200/50 hover:border-brand-blue/20 transition-all
                            snap-start cursor-pointer group relative overflow-hidden
                        "
                    >
                        {/* Image */}
                        <div className="w-24 h-full rounded-xl bg-slate-50 relative overflow-hidden shrink-0">
                            {/* Use img tag for external URLs if domain not in next.config, but mock data URLs are generic alicdn. Assuming we might need unoptimized image or <img /> */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1" title={product.title}>
                                    {product.title}
                                </h3>
                                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                    {product.supplier}
                                </p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] text-slate-400 transform scale-90 origin-bottom-left">MOQ: {product.moq}</div>
                                    <div className="text-sm font-black text-brand-blue">
                                        ¥{product.price.amount}
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Sold Badge */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg shadow-sm">
                            {product.sold > 1000 ? (product.sold / 1000).toFixed(1) + 'k' : product.sold} Sold
                        </div>
                    </Link>
                ))}
            </div>

            {/* Slider Indicator */}
            <div className="flex justify-center mt-2">
                <div className="w-16 h-1 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-blue rounded-full transition-all duration-100" // Brand Blue for this one
                        style={{ width: '30%', transform: `translateX(${scrollProgress * 0.7}%)` }}
                    />
                </div>
            </div>
        </section>
    );
}
