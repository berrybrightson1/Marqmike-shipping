"use client";

import { ShieldCheck, Plus, Star, ArrowRight, Loader2, Store } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Mock Data for Stores (Replace with real API call if needed)
const STORES = [
    {
        id: "shein",
        name: "Shein",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Shein_logo.svg/2560px-Shein_logo.svg.png",
        rating: 4.8,
        url: "https://shein.com"
    },
    {
        id: "alibaba",
        name: "Alibaba",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Alibaba-Logo.png/1200px-Alibaba-Logo.png",
        rating: 4.9,
        url: "https://alibaba.com"
    },
    {
        id: "1688",
        name: "1688",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/30/1688_logo.png",
        rating: 4.7,
        url: "https://1688.com"
    },
    {
        id: "taobao",
        name: "Taobao",
        image: "https://upload.wikimedia.org/wikipedia/zh/5/5b/Taobao_logo.png",
        rating: 4.6,
        url: "https://taobao.com"
    },
    {
        id: "amazon",
        name: "Amazon",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
        rating: 4.9,
        url: "https://amazon.com"
    }
];

export default function StoreSlider() {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                        <Store size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">Featured Stores</h2>
                        <p className="text-xs text-slate-500 font-medium">Browse verified suppliers</p>
                    </div>
                </div>
                <Link href="/stores" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                    View All
                </Link>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                flex gap-4
                overflow-x-auto pb-6 px-2
                no-scrollbar snap-x
                touch-pan-x
            ">
                {STORES.map((store) => (
                    <a
                        key={store.id}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            min-w-[160px] w-[160px] md:min-w-[180px] md:w-[180px] 
                            shrink-0 bg-white rounded-[24px] p-4 
                            shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
                            border border-slate-100/50 
                            group hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 
                            transition-all duration-300 snap-start
                            flex flex-col items-center text-center
                        "
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 p-3 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            <img src={store.image} alt={store.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>

                        <div className="flex items-center gap-1 mb-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-700">{store.rating}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-3">{store.name}</h3>

                        <div className="mt-auto w-full py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            Visit Store
                        </div>
                    </a>
                ))}
            </div>

            {/* Slider Indicator */}
            {STORES.length > 2 && (
                <div className="flex justify-center -mt-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden bg-slate-100">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-100"
                            style={{ width: '30%', transform: `translateX(${scrollProgress * 2.3}px)` }} // Approximate movement
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
