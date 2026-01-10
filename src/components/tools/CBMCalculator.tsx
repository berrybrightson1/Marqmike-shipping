"use client";

import { useState, useEffect } from "react";
import { Calculator, Box, Info } from "lucide-react";

export default function CBMCalculator() {
    const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 });
    const [quantity, setQuantity] = useState(1);
    const [cbm, setCbm] = useState(0);
    const [cost, setCost] = useState(0);

    // Rate: $380 per CBM (Example Sea Freight Rate)
    const RATE_PER_CBM = 380;
    const MIN_CHARGE = 20;

    useEffect(() => {
        // CBM = (L * W * H) / 1,000,000 * Qty
        const singleItemCBM = (dimensions.length * dimensions.width * dimensions.height) / 1000000;
        const totalCBM = singleItemCBM * quantity;

        setCbm(totalCBM);

        let estimatedCost = totalCBM * RATE_PER_CBM;
        if (estimatedCost > 0 && estimatedCost < MIN_CHARGE) estimatedCost = MIN_CHARGE;

        setCost(estimatedCost);
    }, [dimensions, quantity]);

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 shadow-xl border border-white/50">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Length (cm)</label>
                        <input
                            type="number"
                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20 text-slate-800 text-lg sm:text-base border-none"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Width (cm)</label>
                        <input
                            type="number"
                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20 text-slate-800 text-lg sm:text-base border-none"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Height (cm)</label>
                        <input
                            type="number"
                            className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20 text-slate-800 text-lg sm:text-base border-none"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Quantity</label>
                    <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-2">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 rounded-xl bg-white shadow-sm font-bold text-slate-600 hover:text-brand-blue text-xl flex items-center justify-center transition-colors"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center font-bold text-slate-800 text-xl">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 rounded-xl bg-white shadow-sm font-bold text-slate-600 hover:text-brand-blue text-xl flex items-center justify-center transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-5 rounded-3xl flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-wider">Total Volume</p>
                        <p className="text-2xl font-bold text-blue-700">{cbm.toFixed(3)} <span className="text-sm font-medium opacity-60">m³</span></p>
                    </div>
                    <div className="bg-brand-pink/5 p-5 rounded-3xl flex flex-col items-center justify-center text-center border border-brand-pink/10">
                        <p className="text-[10px] font-bold text-brand-pink/60 uppercase mb-1 tracking-wider">Est. Shipping</p>
                        <p className="text-2xl font-bold text-brand-pink">${cost.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 text-[11px] text-slate-400 bg-slate-50 p-4 rounded-2xl">
                    <Info size={16} className="shrink-0 mt-0.5 text-slate-300" />
                    <p className="leading-relaxed">Based on Sea Freight rate of <span className="font-bold text-slate-600">$380/cbm</span>. Minimum charge of $20 applies. Actual cost may vary based on consolidation.</p>
                </div>
            </div>
        </div>
    );
}
