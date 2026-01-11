"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Search, ShoppingBag, ExternalLink, ArrowRight, Zap, Shirt, Smartphone, Home as HomeIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";

interface ShoppingViewProps {
    user: any;
}

export default function ShoppingView({ user }: ShoppingViewProps) {
    const { addToCart } = useCart();

    // Categories Data
    const categories = [
        { id: "fashion", name: "Fashion", icon: Shirt, color: "bg-pink-500", url: "https://www.taobao.com/list/product/fashion.htm" },
        { id: "tech", name: "Electronics", icon: Smartphone, color: "bg-blue-500", url: "https://s.taobao.com/search?q=electronics" },
        { id: "home", name: "Home & Living", icon: HomeIcon, color: "bg-orange-500", url: "https://s.taobao.com/search?q=home+decor" },
        { id: "more", name: "All Categories", icon: ShoppingBag, color: "bg-purple-500", url: "https://www.1688.com/" },
    ];

    // Alibaba Mock Data
    const alibabaProducts = [
        { id: 1, name: "TWS Earbuds 5.3 Noise Cancelling", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=500", price: "2.50", moq: 50, supplier: "Shenzhen Audio Co.", verified: true, rating: "4.8", years: 5 },
        { id: 2, name: "Smart Watch Series 9 Clone", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=500", price: "8.90", moq: 20, supplier: "Guangzhou Tech", verified: true, rating: "4.5", years: 3 },
        { id: 3, name: "Portable Mini Juicer Blender", image: "https://images.unsplash.com/photo-1570222094114-28a9d88aa907?auto=format&fit=crop&q=80&w=500", price: "4.20", moq: 100, supplier: "Yiwu Home Dept", verified: false, rating: "4.2", years: 2 },
        { id: 4, name: "Men's Luxury Business Watch", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500", price: "15.00", moq: 10, supplier: "Foshan Watch Factory", verified: true, rating: "4.9", years: 8 },
        { id: 5, name: "Wireless Gaming Mouse RGB", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=500", price: "5.50", moq: 50, supplier: "Dongguan Electronics", verified: true, rating: "4.6", years: 4 },
        { id: 6, name: "Custom Logo Hoodie 360gsm", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=500", price: "9.50", moq: 25, supplier: "Hangzhou Garment", verified: true, rating: "4.7", years: 6 },
    ];

    const scrollContainerRef = useState<HTMLDivElement | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
        const totalScroll = scrollWidth - clientWidth;
        const progress = (scrollLeft / totalScroll) * 100;
        setScrollProgress(progress);
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            <DashboardHeader user={user} />

            <div className="px-6 -mt-16 relative z-10 space-y-6 max-w-5xl mx-auto">
                {/* Hero Search */}
                <div className="bg-brand-pink rounded-[32px] p-6 text-center text-white shadow-lg shadow-brand-pink/30 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Find Anything from China</h2>
                        <p className="text-brand-blue-100 text-xs mb-6 max-w-xs mx-auto">Search on Taobao or 1688, copy the link, and paste it in Procurement.</p>

                        <div className="flex gap-2">
                            <a
                                href="https://s.taobao.com/search?q="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-white text-brand-blue py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-blue-50 transition-colors"
                            >
                                <Search size={16} />
                                Search Taobao
                            </a>
                            <a
                                href="https://www.1688.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                            >
                                <Search size={16} />
                                Search 1688
                            </a>
                        </div>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                </div>

                {/* Categories */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-sm font-bold text-slate-700">Explore Categories</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {categories.map((cat) => (
                            <a
                                key={cat.id}
                                href={cat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                            >
                                <div className={`w-10 h-10 rounded-full ${cat.color} text-white flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={18} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600 text-center">{cat.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Trending on Alibaba */}
                <div>
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

                    <div
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
                                            <div className="text-lg font-extrabold text-[#FF6600]">${product.price}</div>
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
                    {/* Custom Scroll Indicator */}
                    <div className="flex justify-center mt-2">
                        <div className="w-12 h-1.5 bg-slate-200/60 rounded-full overflow-hidden relative">
                            <div
                                className="absolute top-0 bottom-0 w-4 bg-[#FF6600] rounded-full transition-all duration-150 ease-out"
                                // eslint-disable-next-line react-dom/no-unsafe-inline-style
                                style={{
                                    left: `${Math.min(70, Math.max(0, scrollProgress * 0.7))}%`
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Guide Card */}
                <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden h-[180px] flex flex-col justify-center">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">How to Buy?</h3>
                        <ol className="text-xs text-slate-400 space-y-1 mb-4 list-decimal pl-4">
                            <li>Find an item you love on Taobao/1688</li>
                            <li>Copy the link of the product</li>
                            <li>Go to <b>Procurement</b> and paste the link</li>
                        </ol>
                        <Link href="/dashboard/procurement" className="inline-flex items-center gap-2 bg-white text-slate-900 py-2 px-4 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                            Start Procurement <ArrowRight size={14} />
                        </Link>
                    </div>
                    <ShoppingBag className="absolute -bottom-4 -right-4 text-white/5" size={120} />
                </div>
            </div>
        </div>
    )
}
