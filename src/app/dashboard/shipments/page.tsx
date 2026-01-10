"use client";

import { useState } from "react";
import { Search, Loader2, Package, ArrowRight, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(query);
    const [loading, setLoading] = useState(false); // Mock loading for now

    return (
        <div className="p-6 md:p-10 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Search Results</h1>
                <p className="text-slate-500 mt-1">Found 12 results for "{query}"</p>
            </header>

            {/* Search Input In-Page */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search again..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-blue/20 text-slate-700 font-medium"
                    />
                </div>
                <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                    <Filter size={20} />
                </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Mock Results */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors">
                                <Package size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                Delivered
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">iPhone 15 Pro Max</h3>
                        <p className="text-slate-500 text-sm mb-4">Tracking: MQM-8822-{i}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-sm font-bold text-slate-400">2 days ago</span>
                            <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
