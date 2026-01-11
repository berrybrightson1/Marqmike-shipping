"use client";

import { useState } from "react";
import { Search, Package, ArrowLeft, Copy, CheckCircle, ExternalLink, MapPin, Truck, Ship, Archive, Trash2, Calendar, MoreVertical, X, ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrency } from "@/context/CurrencyContext";

// Mock Data
// Mock Data Removed - Using Real Data
import { getUserOrders } from "@/app/actions/shipment";
import { useEffect } from "react";

export default function ShipmentsPage() {
    const router = useRouter();
    const { currency } = useCurrency();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getUserOrders();
            if (res.success) setShipments(res.data);
            setLoading(false);
        };
        fetchOrders();

        // Real-time polling for new orders (every 5 seconds)
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<any>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Tracking ID copied!");
    };

    const handleDelete = (id: string) => {
        setShipments(prev => prev.filter(s => s.id !== id));
        toast.success("Shipment removed from history");
    };

    const filtered = shipments.filter(s => {
        const matchesSearch = s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.item.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'active') {
            return matchesSearch && s.status !== 'Delivered' && s.status !== 'Cancelled';
        } else {
            return matchesSearch && (s.status === 'Delivered' || s.status === 'Cancelled');
        }
    });

    const openMap = (shipment: any) => {
        setSelectedShipment(shipment);
        setShowMapModal(true);
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-32">
            {/* Header */}
            <header className="bg-white pt-12 pb-6 px-6 shadow-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} aria-label="Go back" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Active Shipments
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        History
                    </button>
                </div>
            </header>

            <div className="p-6">
                {/* Search */}
                <div className="bg-white p-2 pl-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center mb-6 focus-within:ring-2 ring-brand-blue/20 transition-all">
                    <Search className="text-slate-400 shrink-0" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tracking ID or item..."
                        className="w-full py-3 bg-transparent border-none outline-none text-slate-700 font-bold placeholder:font-medium placeholder:text-slate-400"
                    />
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No shipments found</h3>
                            <p className="text-slate-400 text-sm">Your active orders will appear here.</p>
                        </div>
                    ) : (
                        filtered.map((shipment) => (
                            <div key={shipment.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                {/* Delete Action (Visible on Hover/Swipe concept) */}
                                {activeTab === 'history' && (
                                    <button
                                        onClick={() => handleDelete(shipment.id)}
                                        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-20"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                            ${shipment.type === 'Shop Order' ? 'bg-purple-50 text-purple-600' :
                                                shipment.type === 'Procurement' ? 'bg-orange-50 text-orange-600' :
                                                    shipment.type === 'Air' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
                                            {shipment.type === 'Shop Order' ? <ShoppingBag size={20} /> :
                                                shipment.type === 'Procurement' ? <ShoppingCart size={20} /> :
                                                    shipment.type === 'Air' ? <ExternalLink size={20} className="rotate-45" /> : <Ship size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{shipment.item}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                    <Calendar size={10} /> {shipment.date}
                                                </span>
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold truncate max-w-[150px]">
                                                    {shipment.type === 'Shop Order' ? 'Marqmike Shop Order' :
                                                        shipment.type === 'Procurement' ? 'Procurement Request' :
                                                            `${shipment.origin} → ${shipment.destination}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                                        <span className={shipment.progress >= 100 ? 'text-green-600' : 'text-brand-blue'}>{shipment.status}</span>
                                        <span>{shipment.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${shipment.progress >= 100 ? 'bg-green-500' : 'bg-brand-blue'}`}
                                            style={{ width: `${shipment.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 relative">
                                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Tracking ID</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-slate-700 text-xs truncate">{shipment.trackingId}</span>
                                            <button
                                                onClick={() => handleCopy(shipment.trackingId)}
                                                className="text-slate-400 hover:text-brand-blue"
                                                aria-label="Copy Tracking ID"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openMap(shipment)}
                                        className="bg-brand-blue text-white rounded-xl p-3 font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20"
                                        aria-label="Track Live Shipment"
                                    >
                                        <MapPin size={14} />
                                        Track Live
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Modal (Simulated) */}
            {showMapModal && selectedShipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="h-48 bg-slate-200 relative">
                            {/* Fake Map Background */}
                            <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="w-4 h-4 bg-brand-pink rounded-full animate-ping absolute top-0 left-0" />
                                    <div className="w-4 h-4 bg-brand-pink rounded-full relative z-10 border-2 border-white shadow-lg" />
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-md"
                                aria-label="Close Map"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Current Location</h3>
                            <p className="text-slate-500 text-sm mb-6">Package is currently passing through logistics hub near {selectedShipment.origin}.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Estimated Arrival</div>
                                    <div className="text-xl font-bold text-brand-blue">{selectedShipment.eta}</div>
                                </div>
                                <div className="w-px h-10 bg-slate-100" />
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Carrier</div>
                                    <div className="text-xl font-bold text-slate-800">DHL Express</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowMapModal(false)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                Close Map
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
