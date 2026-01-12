"use client";

import React from "react";
import { ChevronLeft, ExternalLink, Search, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ALL_STORES = [
    { name: "1688", url: "https://www.1688.com", color: "bg-[#FF6600]", textColor: "text-white", description: "Wholesale (Cheapest)", rating: 4.8, category: "Wholesale" },
    { name: "Taobao", url: "https://world.taobao.com", color: "bg-[#FF5000]", textColor: "text-white", description: "Retail & Variety", rating: 4.6, category: "Retail" },
    { name: "Alibaba", url: "https://www.alibaba.com", color: "bg-[#F5F5F5]", textColor: "text-[#FF6600]", description: "Global Wholesale", rating: 4.9, category: "Wholesale" },
    { name: "Tmall", url: "https://www.tmall.com", color: "bg-[#DD0000]", textColor: "text-white", description: "Brand Official Stores", rating: 4.7, category: "Brands" },
    { name: "JD.com", url: "https://www.jd.com", color: "bg-[#E33333]", textColor: "text-white", description: "Electronics & Fast Ship", rating: 4.8, category: "Tech" },
    { name: "Pinduoduo", url: "https://www.pinduoduo.com", color: "bg-[#E02E24]", textColor: "text-white", description: "Group Buy Deals", rating: 4.5, category: "Deals" },
    { name: "Amazon", url: "https://amazon.com", color: "bg-[#232F3E]", textColor: "text-white", description: "Global Retail", rating: 4.9, category: "Retail" },
    { name: "eBay", url: "https://ebay.com", color: "bg-[#F5F5F5]", textColor: "text-[#E53238]", description: "Auctions & Deals", rating: 4.4, category: "Marketplace" },
    { name: "AliExpress", url: "https://aliexpress.com", color: "bg-[#FF4747]", textColor: "text-white", description: "Global Dropship", rating: 4.5, category: "Retail" },
];

export default function StoresPage() {
    return (
        <div className="pb-20 pt-6 px-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeft className="text-slate-800" size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Partner Stores</h1>
                    <p className="text-slate-500 font-medium text-xs">Verified suppliers & marketplaces</p>
                </div>
            </div>

            {/* Search (Visual) */}
            <div className="relative mb-8">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search stores..."
                    className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-brand-pink/50 focus:ring-4 focus:ring-brand-pink/5 transition-all shadow-sm"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_STORES.map((store, index) => (
                    <motion.a
                        key={store.name}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="
                            group relative bg-white rounded-[24px] p-5
                            border border-slate-100
                            shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]
                            hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]
                            hover:-translate-y-1
                            flex flex-col items-center text-center
                            transition-all duration-300
                        "
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                            <ExternalLink size={14} />
                        </div>

                        {/* Logo Circle */}
                        <div className={`w-16 h-16 rounded-full ${store.color} ${store.textColor} mb-4 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            <span className="font-black text-sm tracking-tight">{store.name.substring(0, 2).toUpperCase()}</span>
                        </div>

                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{store.category}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-1">{store.name}</h3>
                        <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-1">{store.description}</p>

                        <div className="mt-auto w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold group-hover:bg-brand-pink group-hover:text-white transition-colors">
                            Visit Store
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
