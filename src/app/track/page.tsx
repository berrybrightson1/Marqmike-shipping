"use client";

import { useState } from "react";
import { Search, ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrackingSearchPage() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/track/${trackingId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-blue via-[#003d91] to-brand-blue flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />

            {/* Brand */}
            <div className="absolute top-8 left-0 w-full flex justify-center">
                <h1 className="text-2xl font-bold italic text-white tracking-tight">
                    Marqmike<span className="text-brand-pink">.</span>
                </h1>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl text-center">
                <div className="mb-12">
                    <Package size={80} className="text-white/90 mx-auto mb-8" strokeWidth={1.5} />
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Track Shipment
                    </h2>
                    <p className="text-white/60 text-lg">
                        Enter your waybill number to view real-time status
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full">
                    <div className="relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={24} />
                        <input
                            type="text"
                            placeholder="Enter Waybill No. (e.g., MQM-8821)"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="w-full h-20 rounded-full pl-20 pr-24 bg-white/95 backdrop-blur-md border-2 border-white/40 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-white transition-all shadow-2xl shadow-black/20 text-lg font-medium"
                        />
                        <button
                            type="submit"
                            aria-label="Search tracking"
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 bg-brand-blue rounded-full flex items-center justify-center text-white hover:bg-brand-pink transition-all shadow-lg group-focus-within:scale-110"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </form>

                {/* Help Text */}
                <p className="text-white/40 text-sm mt-8">
                    Need help? <a href="/help" className="text-white/80 hover:text-white underline">Visit Help Center</a>
                </p>
            </div>
        </div>
    );
}
