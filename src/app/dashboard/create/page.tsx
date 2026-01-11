"use client";

import CBMCalculator from "@/components/tools/CBMCalculator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CBMPage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">
                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-20 shrink-0 shadow-xl shadow-brand-blue/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">CBM Calculator</h1>
                    </div>
                    <p className="text-white/60 text-xs">Calculate volume and estimated shipping costs.</p>
                </div>

                {/* Calculator Area */}
                <div className="px-6 mt-6 relative z-10 flex-1 flex flex-col">
                    <CBMCalculator />

                    {/* Additional Info / CTA */}
                    <div className="mt-8 text-center px-4">
                        <p className="text-slate-400 text-xs mb-4">
                            Need help with a consolidation?
                        </p>
                        <a
                            href="https://wa.me/233551171353"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
