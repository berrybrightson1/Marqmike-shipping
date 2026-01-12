"use client";

import { Star, Store } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";

// Original Stores Data (Restored)
const STORES = [
    { name: "1688", url: "https://www.1688.com", color: "bg-[#FF6600]", textColor: "text-white", description: "Wholesale", rating: 4.8 },
    { name: "Taobao", url: "https://world.taobao.com", color: "bg-[#FF5000]", textColor: "text-white", description: "Variety", rating: 4.6 },
    { name: "Alibaba", url: "https://www.alibaba.com", color: "bg-[#F5F5F5]", textColor: "text-[#FF6600]", description: "Global", rating: 4.9 },
    { name: "Tmall", url: "https://www.tmall.com", color: "bg-[#DD0000]", textColor: "text-white", description: "Brands", rating: 4.7 },
    { name: "JD.com", url: "https://www.jd.com", color: "bg-[#E33333]", textColor: "text-white", description: "Fast Ship", rating: 4.8 },
    { name: "Pinduoduo", url: "https://www.pinduoduo.com", color: "bg-[#E02E24]", textColor: "text-white", description: "Deals", rating: 4.5 },
];

export default function StoreSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    // Auto-scroll logic (Continuous Smooth Marquee)
    React.useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let lastTimestamp: number = 0;
        const speed = 0.5; // Pixels per frame - Adjust for smoothness

        const step = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (scrollContainer) {
                // If we are within 1px of the end (or past it), reset to start
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth - 1)) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += speed;
                }
            }
            animationId = requestAnimationFrame(step);
        };

        // Start animation
        animationId = requestAnimationFrame(step);

        // Pause on hover (handled via CSS pointer-events or JS listener? Let's use JS listener for simplicity)
        const pause = () => cancelAnimationFrame(animationId);
        const resume = () => { lastTimestamp = 0; animationId = requestAnimationFrame(step); };

        scrollContainer.addEventListener('mouseenter', pause);
        scrollContainer.addEventListener('mouseleave', resume);
        scrollContainer.addEventListener('touchstart', pause);
        scrollContainer.addEventListener('touchend', resume);

        return () => {
            cancelAnimationFrame(animationId);
            scrollContainer.removeEventListener('mouseenter', pause);
            scrollContainer.removeEventListener('mouseleave', resume);
            scrollContainer.removeEventListener('touchstart', pause);
            scrollContainer.removeEventListener('touchend', resume);
        };
    }, []);

    return (
        <section className="mb-8 group" aria-label="Featured Stores Slider">
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
                <Link href="/dashboard/stores" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
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
                no-scrollbar
                touch-pan-x
                scroll-smooth
            ">
                {STORES.map((store) => (
                    <a
                        key={store.name}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            min-w-[140px] w-[140px] md:min-w-[160px] md:w-[160px] 
                            shrink-0 bg-white rounded-[24px] p-4 
                            shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] 
                            border border-slate-100/50 
                            hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 
                            transition-all duration-300
                            flex flex-col items-center text-center
                        "
                    >
                        {/* CSS Logo Circle */}
                        <div className={`w-16 h-16 rounded-full ${store.color} ${store.textColor} mb-4 flex items-center justify-center shadow-inner group-hover/card:scale-110 transition-transform`}>
                            <span className="font-black text-sm tracking-tight">{store.name.substring(0, 2).toUpperCase()}</span>
                        </div>

                        <div className="flex items-center gap-1 mb-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-slate-700">{store.rating}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-1">{store.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium mb-3">{store.description}</p>

                        <div className="mt-auto w-full py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                            Shop Now
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
                            style={{ width: '30%', transform: `translateX(${scrollProgress * 2.3}px)` }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
