"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Package, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

// Mock fetch - replace with real server action
async function getProducts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: "1", name: "iPhone 15 Pro Max Case", priceRMB: 45, priceGHS: 85, category: "Electronics", image: "/placeholder.jpg", status: "In Stock", cbm: 0.0001 },
        { id: "2", name: "Wireless Earbuds", priceRMB: 120, priceGHS: 220, category: "Electronics", image: "/placeholder.jpg", status: "In Stock", cbm: 0.0002 },
        { id: "3", name: "Smart Watch", priceRMB: 280, priceGHS: 520, category: "Electronics", image: "/placeholder.jpg", status: "Ready in Ghana", cbm: 0.0003 },
    ];
}

export default function StorePage() {
    const { currency, convertPrice } = useCurrency();
    const { totalItems } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        getProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-br from-brand-blue to-[#003d91] pt-8 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-brand-pink/20 rounded-full blur-[100px]" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <Link href="/" className="text-2xl font-bold italic text-white mb-8 inline-block">
                        Marqmike<span className="text-brand-pink">.</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Global Store</h1>
                    <p className="text-white/70 text-sm md:text-base">Browse our catalog from China to Ghana</p>
                </div>
            </header>

            {/* Search & Filter Bar */}
            <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-white/60 p-4 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-blue/20 outline-none font-medium"
                        />
                    </div>
                    <button
                        className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        aria-label="Filter products"
                    >
                        <SlidersHorizontal size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-4xl mx-auto px-6 mt-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-brand-blue" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/store/${product.id}`}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-brand-blue/5 transition-all group"
                            >
                                {/* Image */}
                                <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                    <Package size={40} className="text-slate-300 group-hover:scale-110 transition-transform" />
                                    {product.status === "Ready in Ghana" && (
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">
                                            🇬🇭 IN GHANA
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-brand-blue">
                                            {currency === "RMB" ? "¥" : currency === "GHS" ? "₵" : "$"}
                                            {convertPrice(product.priceRMB, "RMB").toFixed(2)}
                                        </span>
                                        <span className="text-xs text-slate-400">{currency}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No products found</p>
                    </div>
                )}
            </div>

            {/* Floating Cart Button */}
            <button
                onClick={() => setCartOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-brand-blue hover:bg-[#003d91] text-white rounded-full shadow-2xl shadow-brand-blue/40 flex items-center justify-center transition-all hover:scale-110 z-30"
                aria-label="Open cart"
            >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-pink rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {totalItems}
                    </div>
                )}
            </button>

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}
