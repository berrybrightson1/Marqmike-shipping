"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Share2, Heart, Star, ShoppingCart, Truck, ShieldCheck, CheckCircle2, ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";
import { getInventory } from "@/app/actions/product";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            const res = await getInventory();
            if (res.success && res.data) {
                const found = res.data.find((p: any) => p.id === params.id);
                setProduct(found);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.priceGHS || (product.priceRMB * 2.2),
            image: product.imageUrl || `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`,
            quantity: quantity
        });
        toast.success(`Added ${quantity} ${product.name} to cart`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Product not found</div>;
    }

    const images = [
        product.imageUrl,
        `https://placehold.co/400x400/f1f5f9/1e293b?text=Side+View`,
        `https://placehold.co/400x400/f1f5f9/1e293b?text=Detail+Shot`
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header / Nav */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <button title="Go Back" onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeft className="text-slate-800" size={24} />
                </button>
                <div className="font-bold text-slate-900 truncate max-w-[200px]">{product.name}</div>
                <div className="flex gap-2">
                    <button title="Share Product" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                        <Share2 size={20} />
                    </button>
                    <button title="Add to Wishlist" className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-red-500">
                        <Heart size={20} />
                    </button>
                </div>
            </div>

            {/* Hero Image Section */}
            <div className="bg-white pb-6 rounded-b-[32px] shadow-sm mb-4 overflow-hidden">
                <div className="aspect-square w-full relative bg-slate-50">
                    <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                {/* Thumbnails */}
                <div className="flex justify-center gap-3 mt-4 px-4 overflow-x-auto no-scrollbar">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            title={`View Image ${idx + 1}`}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-brand-pink scale-110 shadow-md' : 'border-transparent bg-slate-100'}`}
                        >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="px-5 space-y-6">
                {/* Title & Price */}
                <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h1 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h1>
                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-2xl font-black text-[#FF6600]">{formatPrice(product.priceRMB, 'RMB')}</span>
                        </div>
                    </div>
                    {/* Ratings */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-700 font-bold border border-amber-100">
                            <Star size={14} className="fill-amber-500 text-amber-500" />
                            <span>4.8</span>
                        </div>
                        <span className="text-slate-400 font-medium">120+ sold</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <Truck size={12} /> Free Shipping
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-100 flex gap-6">
                    {['details', 'specs', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 capitalize font-bold text-sm transition-all border-b-2 ${activeTab === tab ? 'text-brand-pink border-brand-pink' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[100px]">
                    {activeTab === 'details' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {product.description || "Experience premium quality with this top-rated item. Sourced directly from trusted manufacturers, ensuring durability and style. Perfect for personal use or resale."}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><ShieldCheck size={20} /></div>
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">Verified</div>
                                        <div className="text-slate-500">Quality Checked</div>
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 size={20} /></div>
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">In Stock</div>
                                        <div className="text-slate-500">Ready to Ship</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'specs' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">MOQ</span>
                                <span className="font-bold text-slate-900 text-sm">{product.moq || 1} Piece(s)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Category</span>
                                <span className="font-bold text-slate-900 text-sm capitalize">{product.category || 'General'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-50">
                                <span className="text-slate-500 text-sm">Material</span>
                                <span className="font-bold text-slate-900 text-sm">Premium Grade</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                                <p className="text-slate-500 text-sm">No reviews yet for this product.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 pb-8 flex items-center gap-4 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
                {/* Quantity */}
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-2 px-3 border border-slate-100">
                    <button title="Decrease Quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900"><Minus size={16} /></button>
                    <span className="font-bold text-slate-900 w-4 text-center">{quantity}</span>
                    <button title="Increase Quantity" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900"><Plus size={16} /></button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-brand-pink text-white rounded-[20px] font-black text-lg shadow-xl shadow-brand-pink/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={20} className="fill-white/20" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
