"use client";

import CBMCalculator from "@/components/tools/CBMCalculator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QuotePage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">
                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-20 shrink-0 shadow-xl shadow-brand-blue/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Get a Quote</h1>
                    </div>
                    <p className="text-white/60 text-xs">Estimate shipping costs instantly.</p>
                </div>

                {/* Calculator Area */}
                <div className="px-6 mt-6 relative z-10 flex-1 space-y-6">
                    <CBMCalculator />

                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white/60 text-center">
                        <h3 className="font-bold text-slate-700 mb-2">Need a custom clearance quote?</h3>
                        <p className="text-xs text-slate-500 mb-4">For large commercial shipments, contact our team directly.</p>
                        <a
                            href="https://wa.me/233249999065"
                            target="_blank"
                            className="bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-lg shadow-green-500/20 inline-flex items-center gap-2"
                        >
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
