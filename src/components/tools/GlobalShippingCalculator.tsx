"use client";

import { useState, useEffect } from "react";
import { Calculator, Box, Info, Plane, Ship, MapPin, Scale } from "lucide-react";

type ShippingMode = "AIR" | "SEA";
type Destination = "GHANA" | "NIGERIA" | "KENYA";

export default function GlobalShippingCalculator() {
    const [mode, setMode] = useState<ShippingMode>("SEA");
    const [destination, setDestination] = useState<Destination>("GHANA");
    const [dimensions, setDimensions] = useState({ length: 0, width: 0, height: 0 }); // cm
    const [weight, setWeight] = useState(0); // kg
    const [quantity, setQuantity] = useState(1);

    // Results
    const [volumetricWeight, setVolumetricWeight] = useState(0);
    const [cbm, setCbm] = useState(0);
    const [chargeableWeight, setChargeableWeight] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);

    // Rates (Mock Global Rates)
    const RATES = {
        GHANA: { AIR: 12, SEA: 380, CURRENCY: "USD" }, // $12/kg, $380/cbm
        NIGERIA: { AIR: 10, SEA: 450, CURRENCY: "USD" },
        KENYA: { AIR: 15, SEA: 400, CURRENCY: "USD" }
    };

    useEffect(() => {
        // Calculations
        // 1. CBM (Total Volume in m3) = (L*W*H / 1,000,000) * Qty
        const singleCBM = (dimensions.length * dimensions.width * dimensions.height) / 1000000;
        const totalCBM = singleCBM * quantity;

        // 2. Volumetric Weight (Air Freight Standard: L*W*H / 6000) * Qty
        const singleVolumetric = (dimensions.length * dimensions.width * dimensions.height) / 6000;
        const totalVolumetric = singleVolumetric * quantity;

        // 3. Actual Weight Total
        const totalActualWeight = weight * quantity;

        // Update State
        setCbm(totalCBM);
        setVolumetricWeight(totalVolumetric);

        // Cost Logic
        let cost = 0;
        let chargeable = 0;

        if (mode === "AIR") {
            // Air Freight uses greater of Actual vs Volumetric
            chargeable = Math.max(totalActualWeight, totalVolumetric);
            cost = chargeable * RATES[destination].AIR;
        } else {
            // Sea Freight uses CBM
            chargeable = totalCBM; // "Chargeable Volume"
            cost = Math.max(20, totalCBM * RATES[destination].SEA); // Min charge $20
        }

        setChargeableWeight(chargeable);
        setEstimatedCost(cost);

    }, [dimensions, weight, quantity, mode, destination]);

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 mb-6 border border-white/50 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink">
                    <Calculator size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Global Rate Estimator</h3>
                    <p className="text-xs text-slate-500">Compare Air vs. Sea Freight</p>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 mb-6">
                {/* Destination */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <MapPin size={10} /> Destination
                    </label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(["GHANA", "NIGERIA", "KENYA"] as Destination[]).map((dest) => (
                            <button
                                key={dest}
                                onClick={() => setDestination(dest)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${destination === dest
                                        ? "bg-white text-brand-blue shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {dest}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setMode("AIR")}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${mode === "AIR"
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                            }`}
                    >
                        <Plane size={24} />
                        <span className="text-xs font-bold">Air Freight</span>
                        <span className="text-[9px] opacity-60">${RATES[destination].AIR}/kg</span>
                    </button>
                    <button
                        onClick={() => setMode("SEA")}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${mode === "SEA"
                                ? "border-brand-blue bg-brand-blue/5 text-brand-blue"
                                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                            }`}
                    >
                        <Ship size={24} />
                        <span className="text-xs font-bold">Sea Shipping</span>
                        <span className="text-[9px] opacity-60">${RATES[destination].SEA}/cbm</span>
                    </button>
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3 lg:col-span-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Weight (kg)</label>
                        <div className="relative">
                            <input
                                type="number"
                                className="w-full p-3 pl-9 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-brand-blue/20"
                                placeholder="0"
                                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                            />
                            <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Length", key: "length" },
                        { label: "Width", key: "width" },
                        { label: "Height", key: "height" }
                    ].map((dim) => (
                        <div key={dim.key} className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">{dim.label} (cm)</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-slate-50 rounded-xl font-bold text-center outline-none focus:ring-2 ring-brand-blue/20"
                                placeholder="0"
                                onChange={(e) => setDimensions({ ...dimensions, [dim.key]: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl">
                    <span className="text-xs font-bold text-slate-500 pl-2">Quantity</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-white shadow text-slate-600 font-bold">-</button>
                        <span className="font-bold text-slate-800 w-4 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-white shadow text-slate-600 font-bold">+</button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className={`mt-6 pt-6 border-t ${mode === "AIR" && chargeableWeight > (weight * quantity) ? "border-amber-200" : "border-slate-100"}`}>

                {/* Volumetric Warning */}
                {mode === "AIR" && chargeableWeight > (weight * quantity) && (
                    <div className="mb-4 bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 items-start">
                        <Info className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs font-bold text-amber-700">Volumetric Weight Applies</p>
                            <p className="text-[10px] text-amber-600/80 leading-tight">
                                Your items are light but bulky. Charged based on volume ({volumetricWeight.toFixed(2)} kg) instead of actual weight ({(weight * quantity)} kg).
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                            {mode === "AIR" ? "Chargeable Weight" : "Total Volume"}
                        </p>
                        <p className="text-xl font-bold text-slate-700">
                            {chargeableWeight.toFixed(2)}
                            <span className="text-sm font-medium text-slate-400">{mode === "AIR" ? " kg" : " m³"}</span>
                        </p>
                    </div>
                    <div className="bg-brand-blue p-4 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-4 -mt-4" />
                        <p className="text-[10px] font-bold text-white/60 uppercase mb-1">Est. Total Cost</p>
                        <p className="text-xl font-bold text-white">${estimatedCost.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
