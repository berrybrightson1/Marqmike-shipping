"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";

const STORES = [
    { name: "1688", url: "https://www.1688.com", color: "bg-[#FF6600]", textColor: "text-white", description: "Wholesale (Cheapest)" },
    { name: "Taobao", url: "https://world.taobao.com", color: "bg-[#FF5000]", textColor: "text-white", description: "Retail & Variety" },
    { name: "Alibaba", url: "https://www.alibaba.com", color: "bg-[#F5F5F5]", textColor: "text-[#FF6600]", description: "Global Wholesale" },
    { name: "Tmall", url: "https://www.tmall.com", color: "bg-[#DD0000]", textColor: "text-white", description: "Brand Official Stores" },
    { name: "JD.com", url: "https://www.jd.com", color: "bg-[#E33333]", textColor: "text-white", description: "Electronics & Fast Ship" },
    { name: "Pinduoduo", url: "https://www.pinduoduo.com", color: "bg-[#E02E24]", textColor: "text-white", description: "Group Buy Deals" },
];

export default function StoreDirectory() {
    return (
        <section className="mb-8">
            <h3 className="text-sm font-bold text-slate-800 mb-4 px-2">Choose a Store to Shop From</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {STORES.map((store) => (
                    <a
                        key={store.name}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            relative overflow-hidden group p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all
                            flex flex-col items-center text-center gap-2 bg-white
                        `}
                    >
                        {/* Color Banner/Circle */}
                        <div className={`w-12 h-12 rounded-full ${store.color} ${store.textColor} flex items-center justify-center font-bold text-sm shadow-inner`}>
                            {store.name.substring(0, 2).toUpperCase()}
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{store.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{store.description}</p>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
                            <ExternalLink size={12} />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
