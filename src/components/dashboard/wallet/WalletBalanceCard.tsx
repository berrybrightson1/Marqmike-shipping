"use client";

import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner is used

export default function WalletBalanceCard({ onTopUp }: { onTopUp: () => void }) {
    const [currency, setCurrency] = useState<"USD" | "GHS" | "RMB">("USD");

    const balances = {
        USD: 1250.00,
        GHS: 14500.50,
        RMB: 850.00
    };

    return (
        <div className="bg-brand-blue text-white rounded-[32px] p-8 shadow-xl shadow-brand-blue/30 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Wallet size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Balance</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">{currency === 'USD' ? '$' : currency === 'GHS' ? '₵' : '¥'}</span>
                                <span className="text-4xl font-bold tracking-tight">{balances[currency].toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-black/20 rounded-full p-1 backdrop-blur-md">
                        {(["USD", "GHS", "RMB"] as const).map((c) => (
                            <button
                                key={c}
                                onClick={() => setCurrency(c)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currency === c ? 'bg-white text-brand-blue shadow-sm' : 'text-white/60 hover:text-white'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onTopUp}
                        className="flex-1 bg-white text-brand-blue py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
                    >
                        <Plus size={18} /> Top Up
                    </button>
                    <button className="flex-1 bg-white/10 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10">
                        <CreditCard size={18} /> Manage Cards
                    </button>
                </div>
            </div>
        </div>
    );
}
