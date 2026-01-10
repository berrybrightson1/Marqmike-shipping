"use client";

import { useState, useEffect } from "react";
import { getTrendingItems, addTrendingItem, deleteTrendingItem } from "@/app/actions/trending";
import { toast } from "sonner";
import { Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function TrendingManager() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({
        title: "",
        image: "",
        price: "",
        url: "",
        moq: "1",
        currency: "CNY"
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        const res = await getTrendingItems();
        if (res.success && res.data) {
            setItems(res.data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const res = await addTrendingItem({
            ...newItem,
            price: parseFloat(newItem.price),
            moq: parseInt(newItem.moq)
        });

        if (res.success) {
            toast.success("Item added to trending feed");
            setNewItem({ title: "", image: "", price: "", url: "", moq: "1", currency: "CNY" });
            loadItems();
        } else {
            toast.error("Failed to add item");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;

        const res = await deleteTrendingItem(id);
        if (res.success) {
            toast.success("Item removed");
            loadItems();
        } else {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Trending Items Manager</h1>
                <p className="text-slate-500 mt-1">Manage the "Hot on 1688" feed displayed on the user dashboard.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Item Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 sticky top-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-brand-blue" />
                            Add New Item
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Item Title</label>
                                <input
                                    required
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                    placeholder="e.g. Bluetooth Speaker"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Image URL</label>
                                <input
                                    required
                                    value={newItem.image}
                                    onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Price</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Currency</label>
                                    <select
                                        value={newItem.currency}
                                        onChange={e => setNewItem({ ...newItem, currency: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                    >
                                        <option value="CNY">CNY (¥)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="GHS">GHS (₵)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">MOQ</label>
                                    <input
                                        required
                                        type="number"
                                        value={newItem.moq}
                                        onChange={e => setNewItem({ ...newItem, moq: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Source URL (1688/Taobao)</label>
                                <input
                                    required
                                    value={newItem.url}
                                    onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-brand-blue"
                                    placeholder="https://detail.1688.com..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                Add to Feed
                            </button>
                        </form>
                    </div>
                </div>

                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg text-slate-700">Active Items ({items.length})</h3>

                    {loading ? (
                        <div className="text-center py-20"><Loader2 className="animate-spin text-brand-blue mx-auto" /></div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-[24px]">
                            No items in the feed. Note: The dashboard will show mock data until you add at least one item here.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 line-clamp-2 text-sm mb-1">{item.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                            <span className="font-bold text-brand-blue">{item.currency} {item.price}</span>
                                            <span>MOQ: {item.moq}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={item.url} target="_blank" className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-brand-blue transition-colors">
                                                <ExternalLink size={14} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
