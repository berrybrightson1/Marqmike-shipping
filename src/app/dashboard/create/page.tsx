"use client";

import { createShipment } from "@/app/actions/shipment";
import { ArrowLeft, Box, MapPin, User, Hash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreateShipmentPage() {
    const [loading, setLoading] = useState(false);

    // Auto-generate a random tracking ID for convenience
    const defaultTracking = `TRK-${Math.floor(Math.random() * 1000000)}`;

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative">

                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-12 px-6 rounded-b-[40px] relative overflow-hidden mb-[-40px]">
                    <div className="relative z-10 flex items-center gap-4">
                        <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl text-white font-bold">New Shipment</h1>
                    </div>
                </div>

                {/* Form Container */}
                <div className="px-6 relative z-10">
                    <form
                        action={(formData) => {
                            setLoading(true);
                            createShipment(formData);
                        }}
                        className="bg-white rounded-3xl p-6 shadow-xl shadow-brand-blue/5 border border-white/50 space-y-5"
                    >
                        {/* Tracking ID */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tracking ID</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink/60">
                                    <Hash size={16} />
                                </div>
                                <input
                                    name="trackingId"
                                    aria-label="Tracking ID"
                                    type="text"
                                    defaultValue={defaultTracking}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-brand-blue focus:outline-none focus:border-brand-pink/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Shipper */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Shipper Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <User size={16} />
                                </div>
                                <input
                                    name="shipperName"
                                    aria-label="Shipper Name"
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-brand-blue placeholder:text-slate-300 focus:outline-none focus:border-brand-blue/30 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Recipient */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Recipient Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Box size={16} />
                                </div>
                                <input
                                    name="recipientName"
                                    aria-label="Recipient Name"
                                    type="text"
                                    placeholder="e.g. Jane Smith"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-brand-blue placeholder:text-slate-300 focus:outline-none focus:border-brand-blue/30 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Origin */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Origin City</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <MapPin size={16} />
                                </div>
                                <input
                                    name="origin"
                                    aria-label="Origin City"
                                    type="text"
                                    placeholder="e.g. Accra"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-brand-blue placeholder:text-slate-300 focus:outline-none focus:border-brand-blue/30 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Destination City</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-pink/60">
                                    <MapPin size={16} />
                                </div>
                                <input
                                    name="destination"
                                    aria-label="Destination City"
                                    type="text"
                                    placeholder="e.g. London"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-brand-blue placeholder:text-slate-300 focus:outline-none focus:border-brand-pink/30 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-pink hover:bg-[#e0007d] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-pink/30 transition-all text-xs mt-4 flex items-center justify-center"
                        >
                            {loading ? "Creating..." : "Create Label"}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
