"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Search, ShoppingBag, ExternalLink, ArrowRight, Zap, Shirt, Smartphone, Home as HomeIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ShoppingViewProps {
    user: any;
}

export default function ShoppingView({ user }: ShoppingViewProps) {
    const { addToCart } = useCart();
    // Using simple mock products for "Trending" to demonstrate Cart
    const categories = [
        { id: "fashion", name: "Fashion", icon: Shirt, color: "bg-pink-500", url: "https://www.taobao.com/list/product/fashion.htm" },
        { id: "tech", name: "Electronics", icon: Smartphone, color: "bg-blue-500", url: "https://s.taobao.com/search?q=electronics" },
        { id: "home", name: "Home & Living", icon: HomeIcon, color: "bg-orange-500", url: "https://s.taobao.com/search?q=home+decor" },
        { id: "more", name: "All Categories", icon: ShoppingBag, color: "bg-purple-500", url: "https://www.1688.com/" },
    ];

    const trendingStores = [
        { id: 1, name: "Zara China", type: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=500", url: "https://zara.tmall.com/", price: 45 },
        { id: 2, name: "Xiaomi Official", type: "Tech", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500", url: "https://xiaomi.tmall.com/", price: 299 },
        { id: 3, name: "Home Decor Co.", type: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=500", url: "https://s.taobao.com", price: 12 },
    ];

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

                {/* Trending Stores (Now Products with Add to Cart) */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Zap size={16} className="text-amber-500 fill-amber-500" />
                            Trending Products
                        </h3>
                        <span className="text-[10px] font-bold text-brand-blue">Weekly Picks</span>
                    </div>

                    <div className="grid gap-4">
                        {trendingStores.slice(0, 4).map((store) => (
                            <div key={store.id} className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                    <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold text-brand-pink bg-brand-pink/5 px-2 py-1 rounded-md mb-1 inline-block">{store.type}</span>
                                    <h4 className="font-bold text-slate-800 line-clamp-1">{store.name}</h4>
                                    <div className="flex gap-1 text-[10px] text-slate-400 mt-1">
                                        Import from China • Est. ${store.price}
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToCart({
                                        id: store.id,
                                        name: store.name,
                                        price: store.price,
                                        image: store.image,
                                        quantity: 1,
                                        url: store.url
                                    })}
                                    className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 hover:scale-110 transition-transform active:scale-90"
                                    aria-label="Add to cart"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guide Card */}
                <div className="bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">How to Buy?</h3>
                        <ol className="text-xs text-slate-400 space-y-2 mb-4 list-decimal pl-4">
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
