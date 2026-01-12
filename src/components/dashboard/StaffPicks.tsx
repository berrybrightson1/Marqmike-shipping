"use client";

import { ShieldCheck, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef, MouseEvent } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";
import { getInventory } from "@/app/actions/product";

// Define a safe type for Product
interface Product {
    id: string;
    name: string;
    imageUrl?: string | null;
    priceRMB: number;
    priceGHS: number;
    moq?: number;
}

export default function StaffPicks() {
    // Hooks must be unconditional
    const { addToCart, cart } = useCart();
    const { formatPrice } = useCurrency();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Fetch Data
    useEffect(() => {
        let mounted = true;

        const fetchProducts = async () => {
            try {
                const res = await getInventory();
                if (mounted && res.success && Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("StaffPicks fetch error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            mounted = false;
        };
    }, []);

    // Handlers
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    const handleAddToCart = (e: MouseEvent, item: Product) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: item.id,
            name: item.name,
            price: item.priceGHS || (item.priceRMB * 2.2),
            image: item.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`,
            quantity: 1
        });
        toast.success("Added to cart");
    };

    const getItemCount = (id: string) => {
        const cartItem = cart.find(i => i.id === id);
        return cartItem ? cartItem.quantity : 0;
    };

    // Conditional Rendering - Early Returns
    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="relative">
            <div className="flex justify-between items-center mb-6 px-1">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Staff Picks</h2>
                        <p className="text-xs text-slate-500 font-medium">Verified essentials for your business</p>
                    </div>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="
                flex gap-4
                overflow-x-auto pb-6 px-1
                no-scrollbar snap-x 
                touch-pan-x
                "
            >
                {products.map((item) => {
                    const count = getItemCount(item.id);

                    return (
                        <div key={item.id} className="relative min-w-[200px] w-[200px] shrink-0 bg-white rounded-[20px] p-3 shadow-sm border border-slate-100 group hover:border-brand-blue/30 hover:shadow-lg transition-all snap-start flex flex-col h-full">

                            {/* Click Overlay (Z-Index 10) */}
                            <Link
                                href={`/dashboard/product/${item.id}`}
                                className="absolute inset-0 z-10 rounded-[20px]"
                                aria-label={`View ${item.name}`}
                            />

                            {/* Image Badge Container */}
                            <div className="relative w-full h-32 rounded-xl bg-slate-50 overflow-hidden mb-3 pointer-events-none">
                                <img
                                    src={item.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`}
                                    alt={item.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {item.moq && (
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur">
                                        MOQ: {item.moq}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 pointer-events-none">
                                <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-2 h-9" title={item.name}>
                                    {item.name}
                                </h4>

                                <div className="flex items-end justify-between mb-2 mt-auto">
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-medium">Price</div>
                                        <div className="text-lg font-extrabold text-[#FF6600]">
                                            {formatPrice(item.priceRMB || 0, 'RMB')}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Area (Z-Index 20) */}
                                <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-2 relative z-20 pointer-events-auto">
                                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[80px]">In Stock</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, item)}
                                        className={`
                                            w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer relative z-30
                                            ${count > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-[#FF6600]'}
                                        `}
                                    >
                                        {count > 0 ? <ShieldCheck size={16} /> : <Plus size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Indicator */}
            {products.length > 2 && (
                <div className="flex justify-center -mt-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden bg-slate-100">
                        <div
                            className="h-full bg-brand-blue rounded-full transition-all duration-100"
                            style={{ width: '30%', transform: `translateX(${scrollProgress * 0.7}%)` }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
