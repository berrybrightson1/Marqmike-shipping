"use client";

import { useState } from "react";
import { Bell, Search, ScanLine, DollarSign } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardHeader() {
    const { currency, setCurrency } = useCurrency();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotifs, setShowNotifs] = useState(false);

    const toggleCurrency = () => {
        if (currency === 'USD') setCurrency('GHS');
        else if (currency === 'GHS') setCurrency('NGN');
        else setCurrency('USD');
    };

    return (
        <div className="relative">
            {/* Background Layer (Clipped) */}
            <div className="absolute inset-0 bg-brand-blue rounded-b-[40px] overflow-hidden z-0 h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </div>

            {/* Content & Height Wrapper */}
            <div className="pt-12 pb-24 px-6">
                <div className="relative z-20">
                    {/* Top Row */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5">
                                {/* Placeholder Avatar */}
                                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Howard" alt="User" />
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-medium tracking-wide uppercase">Welcome Back</p>
                                <h2 className="text-white text-lg font-bold">Hi Howard</h2>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* Currency Toggle */}
                            <button
                                onClick={toggleCurrency}
                                className="h-10 px-3 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors gap-1.5"
                            >
                                <DollarSign size={14} className="text-brand-pink" />
                                <span className="text-xs font-bold">{currency}</span>
                            </button>

                            <div className="relative">
                                <button
                                    aria-label="Notifications"
                                    onClick={() => setShowNotifs(!showNotifs)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors relative"
                                >
                                    <Bell size={20} />
                                    {/* Unread Dot (Mock logic) */}
                                    <div className="absolute top-2 right-2.5 w-2 h-2 bg-brand-pink rounded-full border border-brand-blue" />
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifs && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-brand-blue/20 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Notifications</span>
                                            <Link href="/dashboard/notifications" onClick={() => setShowNotifs(false)} className="text-xs font-bold text-brand-blue hover:underline">View All</Link>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer text-left">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-xs text-slate-800">Shipment Update</span>
                                                        <span className="text-[9px] text-slate-400 font-bold">2m</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-tight">Package #MQM-8821 has arrived at the local facility.</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl text-white font-bold mb-6">My Shipments</h1>

                    {/* Search Bar */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
                        if (input) {
                            router.push(`/dashboard?search=${encodeURIComponent(input)}`);
                            setSearchTerm(""); // Clear on submit to hide dropdown
                        }
                    }} className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <Search size={20} />
                        </div>
                        <input
                            name="search"
                            type="text"
                            placeholder="Search shipment"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:bg-black/30 transition-all"
                            autoComplete="off"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                            <ScanLine size={20} />
                        </div>

                        {/* Search Dropdown */}
                        {searchTerm && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-brand-blue rounded-3xl shadow-2xl overflow-hidden border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                            <Search size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">Search for "{searchTerm}"</p>
                                            <p className="text-white/50 text-[10px]">Search global inventory</p>
                                        </div>
                                    </button>
                                    {/* Quick matches placeholder (could be real data) */}
                                    <div className="mt-2 border-t border-white/10 pt-2 px-3 pb-2">
                                        <p className="text-white/40 text-[10px] font-bold uppercase mb-2">Suggestions</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white hover:bg-white/10 cursor-pointer">iPhone 15</span>
                                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white hover:bg-white/10 cursor-pointer">Smart Watch</span>
                                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white hover:bg-white/10 cursor-pointer">Shipping Rates</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
