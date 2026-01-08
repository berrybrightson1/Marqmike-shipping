"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WalletBalanceCard from "@/components/dashboard/wallet/WalletBalanceCard";
import TransactionHistory from "@/components/dashboard/wallet/TransactionHistory";
import TopUpModal from "@/components/dashboard/wallet/TopUpModal";
import { useState } from "react";

export default function WalletPage() {
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F2F6FC]">
            {/* Reuse DashboardHeader but we might want to override title or just rely on its logical smarts (it currently hardcodes 'My Shipments' or takes props?) 
                Looking at DashboardHeader code... it hardcodes 'My Shipments'. 
                We might need to refactor DashboardHeader to accept a title later. 
                For now, let's just use it, and maybe overlay a title or accept the inconsistency until refactor.
            */}
            <DashboardHeader />

            <div className="px-6 -mt-16 relative z-10 space-y-6 pb-24 max-w-5xl mx-auto">
                {/* Override Header Title visually by placing a new one? No, that looks bad. 
                   Ideally DashboardHeader should take a title prop. I will do that as a quick refactor if needed.
                   For now, let's just render the content.
                */}

                <WalletBalanceCard onTopUp={() => setIsTopUpOpen(true)} />

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <TransactionHistory />
                    </div>
                    <div className="space-y-6">
                        {/* Quick Actions / Stats */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-lg shadow-slate-200/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Monthly Spend</h3>
                            <div className="h-40 flex items-end gap-2">
                                {/* Mock Bar Chart */}
                                {[40, 70, 45, 90, 60, 80].map((h, i) => (
                                    <div key={i} className="flex-1 bg-brand-blue/10 rounded-t-xl relative overflow-hidden group">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 left-0 right-0 bg-brand-blue/50 group-hover:bg-brand-blue transition-colors rounded-t-xl" />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between text-xs font-bold text-slate-400">
                                <span>Jan</span>
                                <span>Jun</span>
                            </div>
                        </div>

                        {/* Promo / Info */}
                        <div className="bg-gradient-to-br from-brand-pink to-purple-600 rounded-[32px] p-6 text-white shadow-lg shadow-purple-500/20">
                            <h3 className="font-bold text-lg mb-2">Get 5% Cashback</h3>
                            <p className="text-sm text-white/80 mb-4">Top up via bank transfer to earn rewards.</p>
                            <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold text-xs hover:bg-purple-50 transition-colors">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>

            <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
        </div>
    );
}
