"use client";

import { useState } from "react";
import { Search, MapPin, Clock, ArrowRight, ChevronLeft, Package, CheckCircle2, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock Timeline Data for visual demo
const mockTimeline = [
    { status: "Delivered", date: "Oct 24, 2:30 PM", location: "Accra, GH", done: false, icon: CheckCircle2 },
    { status: "Out for Delivery", date: "Oct 24, 08:15 AM", location: "Accra, GH", done: false, icon: Truck },
    { status: "Arrived at Warehouse", date: "Oct 22, 11:00 AM", location: "Guangzhou, CN", done: true, icon: Package },
];

export default function TrackingPage() {
    const router = useRouter();
    const [trackingId, setTrackingId] = useState("");

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingId.trim()) {
            router.push(`/dashboard/shipment/${trackingId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-32 relative overflow-hidden">
            {/* Header */}
            <div className="bg-brand-blue pt-12 pb-24 px-6 rounded-b-[40px] relative overflow-hidden shadow-xl shadow-brand-blue/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                {/* Back Button */}
                <Link href="/dashboard" className="mb-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                    <ChevronLeft size={24} />
                </Link>

                <h1 className="text-2xl font-bold text-white relative z-10 mb-2">Track Package</h1>
                <p className="text-white/60 text-sm relative z-10">Real-time status updates.</p>
            </div>

            <div className="px-6 -mt-12 relative z-10">
                {/* Input Card */}
                <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 mb-8">
                    <form onSubmit={handleTrack}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Tracking Number</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="MQM-..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-brand-blue font-bold focus:outline-none focus:border-brand-blue transition-colors placeholder:text-slate-300/50"
                                />
                            </div>
                            <button
                                type="submit"
                                aria-label="Track"
                                className="bg-brand-blue text-white w-14 rounded-2xl flex items-center justify-center hover:bg-[#003d91] transition-colors shadow-lg shadow-brand-blue/20"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Searches (Simulated Timeline Preview) */}
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Recent Checks</h3>

                <div className="space-y-4">
                    {/* Active Shipment Card */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-pink/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h4 className="font-bold text-brand-blue text-lg">MQM-8292</h4>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    In Transit
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                <Truck size={20} />
                            </div>
                        </div>

                        {/* Mini Timeline Visualization */}
                        <div className="relative pl-4 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-200 ring-1 ring-slate-100" />
                                <p className="text-xs text-slate-400">Oct 24 • 08:30 AM</p>
                                <p className="text-sm font-bold text-slate-700">Arrived at Airport</p>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-brand-blue ring-4 ring-brand-blue/10 shadow-sm" />
                                <p className="text-xs text-slate-400">Oct 22 • 02:15 PM</p>
                                <p className="text-sm font-bold text-slate-700">Departed Shanghai</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                            <Link href="/dashboard/shipment/MQM-8292" className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:gap-2 transition-all">
                                View Full Details <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
