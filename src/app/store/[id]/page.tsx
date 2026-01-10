"use client";

import { useState, use } from "react";
import { ChevronLeft, Package, Ruler, ShoppingCart, Calculator, Plus } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import WhatsAppCheckoutModal from "@/components/checkout/WhatsAppCheckoutModal";

// Mock product data
const mockProduct = {
    id: "1",
    name: "iPhone 15 Pro Max Luxury Case",
    priceRMB: 45,
    priceGHS: 85,
    category: "Electronics",
    description: "Premium silicone case with shockproof design. Available in multiple colors.",
    specs: {
        weight: "0.05 kg",
        dimensions: "16cm x 8cm x 1cm",
        cbm: 0.000128
    },
    status: "In Stock"
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { currency, convertPrice } = useCurrency();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [showCBM, setShowCBM] = useState(false);

    const product = mockProduct; // In real app: fetch by ID
    const totalCBM = (product.specs.cbm * quantity).toFixed(6);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.priceRMB,
            image: "",
            quantity: quantity,
            url: ""
        });
    };

    return (
        <>
            <div className="min-h-screen bg-[#F2F6FC] pb-24">
                {/* Back Button */}
                <div className="max-w-4xl mx-auto px-6 pt-6">
                    <Link href="/store" className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors w-fit">
                        <ChevronLeft size={18} />
                        <span className="font-bold text-sm">Back to Store</span>
                    </Link>
                </div>

                {/* Product */}
                <div className="max-w-4xl mx-auto px-6 mt-6 space-y-6">
                    {/* Image */}
                    <div className="aspect-square md:aspect-video bg-white rounded-[32px] border border-slate-100 shadow-xl flex items-center justify-center overflow-hidden">
                        <Package size={120} className="text-slate-200" />
                    </div>

                    {/* Info Card */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
                        <p className="text-slate-500 text-sm mb-6">{product.category}</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-100">
                            <span className="text-4xl font-bold text-brand-blue">
                                {currency === "RMB" ? "¥" : currency === "GHS" ? "₵" : "$"}
                                {convertPrice(product.priceRMB, "RMB").toFixed(2)}
                            </span>
                            <span className="text-slate-400 font-bold">{currency}</span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Quantity</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* CBM Accordion */}
                        <button
                            onClick={() => setShowCBM(!showCBM)}
                            className="w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100 transition-colors mb-6"
                            aria-label="Toggle CBM calculator"
                        >
                            <div className="flex items-center gap-3">
                                <Calculator size={20} className="text-brand-blue" />
                                <span className="font-bold text-slate-700">CBM Calculator</span>
                            </div>
                            <span className="text-xs font-bold text-brand-blue">{showCBM ? "Hide" : "Show"}</span>
                        </button>

                        {showCBM && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Dimensions:</span>
                                    <span className="font-bold text-slate-800">{product.specs.dimensions}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Per Unit CBM:</span>
                                    <span className="font-bold text-slate-800">{product.specs.cbm}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-blue-200">
                                    <span className="text-slate-600">Total CBM (x{quantity}):</span>
                                    <span className="font-bold text-brand-blue text-base">{totalCBM}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    💡 CBM (Cubic Meter) determines shipping cost. Lower CBM = Lower cost.
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-brand-blue text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add to Cart
                            </button>
                            <button
                                onClick={() => setCheckoutOpen(true)}
                                className="flex-1 bg-brand-pink text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-pink/30 hover:bg-[#e0007d] transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <WhatsAppCheckoutModal
                isOpen={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                product={product}
                quantity={quantity}
                totalCBM={parseFloat(totalCBM)}
            />
        </>
    );
}
