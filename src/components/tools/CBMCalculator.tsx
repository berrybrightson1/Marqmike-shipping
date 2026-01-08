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
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Calculator size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Shipping Estimator</h3>
                    <p className="text-xs text-slate-500">Calculate CBM & Cost</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Length (cm)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Width (cm)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20"
                            placeholder="0"
                            onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-2">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-lg bg-white shadow-sm font-bold text-slate-600 hover:text-brand-blue"
                        >
                            -
                        </button>
                        <span className="flex-1 text-center font-bold text-slate-800">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 rounded-lg bg-white shadow-sm font-bold text-slate-600 hover:text-brand-blue"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Total Volume</p>
                        <p className="text-xl font-bold text-blue-700">{cbm.toFixed(3)} <span className="text-sm font-medium">m³</span></p>
                    </div>
                    <div className="bg-brand-pink/10 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-brand-pink uppercase mb-1">Est. Cost</p>
                        <p className="text-xl font-bold text-brand-pink">${cost.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <p>Based on Sea Freight rate of $380/cbm. Minimum charge apply. Actual cost may vary.</p>
                </div>
            </div>
        </div>
    );
}
