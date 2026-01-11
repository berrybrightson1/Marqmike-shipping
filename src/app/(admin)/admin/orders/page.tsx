"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, Package, Clock, CheckCircle, RotateCw, ShoppingBag, Eye, X, ExternalLink, RefreshCw, MessageCircle, Bell } from "lucide-react";
import { getAdminOrders, updateOrderStatus } from "@/app/actions/orders";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { useCurrency } from "@/context/CurrencyContext";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

const TABS = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'completed', label: 'Completed' }
];

export default function AdminOrdersPage() {
    const { currency } = useCurrency();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null); // For Modal
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();

        // Auto-refresh orders list every 5 seconds
        const interval = setInterval(() => {
            loadOrders(true); // true = silent (no loading spinner)
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadOrders = async (silent = false) => {
        if (!silent) setLoading(true);
        const res = await getAdminOrders();
        if (res.success) {
            setOrders(res.data || []);
        } else {
            console.error("Failed to load orders");
        }
        if (!silent) setLoading(false);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

        const res = await updateOrderStatus(id, newStatus);
        if (res.success) {
            toast.success("Status updated");
        } else {
            toast.error("Failed to update status");
            loadOrders(); // Revert on fail
        }
    };

    const handleGenerateTracking = async (id: string) => {
        // Generate a tracking ID (e.g. TRK-...)
        const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, trackingId } : o));

        const res = await updateOrderStatus(id, "Processing", trackingId);
        if (res.success) {
            toast.success(`Tracking ID Generated: ${trackingId}`);
        } else {
            toast.error("Failed to generate tracking ID");
            loadOrders();
        }
    };

    // Derived state for filtering
    const filteredOrders = orders.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.refCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Shop Orders</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => loadOrders()}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-colors"
                        aria-label="Refresh orders"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-brand-blue transition-colors shadow-sm"
                />
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="w-full relative">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                            <tr>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Ref</th>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</th>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking</th>
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-3 px-4 align-top">
                                            <div className="font-mono text-[10px] font-bold text-brand-blue bg-brand-blue/5 px-2 py-1 rounded w-fit">
                                                {order.refCode}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                                <span className="block text-[9px] text-slate-300 font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="font-bold text-slate-800 text-xs">{order.customerName}</div>
                                            <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                {order.items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                                                        <span className="w-4 h-4 bg-slate-100 rounded text-[9px] font-bold text-slate-500 flex items-center justify-center shrink-0">
                                                            {item.quantity}
                                                        </span>
                                                        <span className="truncate max-w-[150px]" title={item.itemName}>{item.itemName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="font-bold text-slate-800 text-xs">
                                                Coming Soon
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            {order.trackingId ? (
                                                <div className="flex flex-col gap-1 items-start">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                        <Package size={12} className="text-slate-400" />
                                                        {order.trackingId}
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <button
                                                            onClick={() => {
                                                                const phone = order.customerPhone?.replace(/\D/g, '') || "";
                                                                const message = `Hello ${order.customerName}, your order *${order.refCode}* has been processed! Your tracking ID is *${order.trackingId}*. You can track it here: https://marqmike.com/track`;
                                                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                                                            }}
                                                            title="Chat on WhatsApp"
                                                            className="w-7 h-7 flex items-center justify-center text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-full transition-colors"
                                                        >
                                                            <MessageCircle size={14} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                const { notifyAndSyncOrder } = await import("@/app/actions/orders");
                                                                const res = await notifyAndSyncOrder(order.id);
                                                                if (res.success) {
                                                                    toast.success(`Notification sent & Order synced for ${order.customerName}`);
                                                                } else {
                                                                    toast.error(res.error || "Failed to notify");
                                                                }
                                                            }}
                                                            title="Send App Notification & Sync"
                                                            className="w-7 h-7 flex items-center justify-center text-brand-blue hover:text-brand-blue/80 bg-brand-blue/5 hover:bg-brand-blue/10 rounded-full transition-colors"
                                                        >
                                                            <Bell size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleGenerateTracking(order.id)}
                                                    className="text-[10px] font-bold text-brand-blue bg-brand-blue/5 hover:bg-brand-blue/10 px-2 py-1.5 rounded transition-colors"
                                                >
                                                    Generate ID
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <select
                                                aria-label="Order Status"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`
                                                    text-xs font-bold px-2 py-1.5 rounded-lg border-2 outline-none cursor-pointer transition-colors
                                                    ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                                                    ${order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                                                    ${order.status === 'Shipped' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                                                    ${order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : ''}
                                                    ${order.status === 'Cancelled' ? 'bg-slate-50 text-slate-500 border-slate-100' : ''}
                                                `}
                                            >
                                                {STATUS_OPTIONS.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-right align-top">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-slate-400 hover:text-brand-blue p-2 hover:bg-brand-blue/5 rounded-full transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Order Details Modal --- */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Order Details</h3>
                                    <p className="text-slate-500 text-sm font-mono">{selectedOrder.refCode}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Customer</p>
                                        <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.customerPhone}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status & Tracking</p>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${selectedOrder.status === 'Pending' ? 'bg-amber-500' : selectedOrder.status === 'Processing' ? 'bg-blue-500' : selectedOrder.status === 'Shipped' ? 'bg-purple-500' : selectedOrder.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="font-bold text-slate-700">{selectedOrder.status}</span>
                                        </div>
                                        <p className="text-xs font-mono text-slate-400">{selectedOrder.trackingId || "No Tracking ID"}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-brand-blue" />
                                        Ordered Items ({selectedOrder.items.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-4 p-3 border border-slate-100 rounded-xl hover:border-brand-blue/20 hover:bg-brand-blue/5 transition-all group">
                                                {/* Image Thumbnail */}
                                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                                                    {item.itemUrl && item.itemUrl.startsWith('http') ? (
                                                        <img src={item.itemUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-800 truncate">{item.itemName}</p>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                        <span>Qty: <b className="text-slate-800">{item.quantity}</b></span>
                                                        <span>•</span>
                                                        <span>Price: <b className="text-slate-800">¥{item.priceAtTime}</b></span>
                                                    </div>
                                                </div>

                                                {item.itemUrl && (
                                                    <a
                                                        href={item.itemUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="self-center p-2 text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-blue/10 rounded-lg"
                                                        title="Open Link"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <div className="text-right">
                                        <p className="text-slate-500 text-sm">Total Amount</p>
                                        <p className="text-2xl font-bold text-brand-blue">¥{selectedOrder.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
