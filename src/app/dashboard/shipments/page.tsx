"use client";

import { useState, useEffect } from "react";
import { Search, Package, ArrowLeft, Copy, ExternalLink, MapPin, Ship, Trash2, Calendar, ShoppingBag, ShoppingCart, CheckCircle, Truck, Info, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserOrders, createConsolidatedShipment } from "@/app/actions/shipment";

type TabType = 'request' | 'warehouse' | 'shipment';

export default function ShipmentsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>('request');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Selection for Warehouse Tab
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isShipping, setIsShipping] = useState(false);

    // Map Modal
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<any>(null);

    const fetchOrders = async () => {
        const res = await getUserOrders();
        if (res.success) {
            setOrders(res.data);

            // Auto-switch tab if empty? No, keep user preference or default to 'request'
            // But if user has nothing in requests but items in warehouse, maybe helpful.
            // For now, simple.
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    // Filter Items based on Tab and Search
    const filtered = orders.filter(item => {
        const matchesSearch = item.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ref?.toLowerCase().includes(searchTerm.toLowerCase());

        // Exact Tab Match (Backend sets 'tab' property)
        const tabMatch = item.tab === activeTab;

        return matchesSearch && tabMatch;
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleShipSelected = async () => {
        if (selectedIds.size === 0) return;

        setIsShipping(true);
        // Find selected items to get their correct type logic
        const itemsToShip = orders
            .filter(o => selectedIds.has(o.id))
            .map(o => ({ id: o.id, type: o.type === 'Shop' ? 'Shop' : 'Procurement' })); // strict typing match

        const res = await createConsolidatedShipment(itemsToShip as any);

        if (res.success) {
            toast.success("Shipment Created! Track it in the 'Shipments' tab.");
            setSelectedIds(new Set());
            setActiveTab('shipment'); // Switch to shipments tab
            fetchOrders();
        } else {
            toast.error(res.error || "Failed to create shipment");
        }
        setIsShipping(false);
    };

    const openMap = (shipment: any) => {
        setSelectedShipment(shipment);
        setShowMapModal(true);
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-32">
            {/* Header */}
            <header className="bg-white pt-12 pb-6 px-6 shadow-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
                </div>

                {/* 3 Tabs Container */}
                <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto">
                    {(['request', 'warehouse', 'shipment'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs sm:text-sm font-bold transition-all capitalize whitespace-nowrap px-2
                                ${activeTab === tab ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab === 'request' ? 'Requests' : tab === 'warehouse' ? 'My Warehouse' : 'Shipments'}
                            {/* Badges could go here */}
                        </button>
                    ))}
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
                        placeholder="Search items, tracking ID..."
                        className="w-full py-3 bg-transparent border-none outline-none text-slate-700 font-bold placeholder:font-medium placeholder:text-slate-400"
                    />
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                    {/* Empty State */}
                    {filtered.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {activeTab === 'request' && <ShoppingCart size={32} className="text-slate-400" />}
                                {activeTab === 'warehouse' && <Box size={32} className="text-slate-400" />}
                                {activeTab === 'shipment' && <Truck size={32} className="text-slate-400" />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">
                                {activeTab === 'request' ? 'No active requests' :
                                    activeTab === 'warehouse' ? 'Warehouse empty' :
                                        'No shipments found'}
                            </h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                {activeTab === 'request' ? 'New orders or procurement requests will appear here.' :
                                    activeTab === 'warehouse' ? 'Items we have purchased for you will show up here, ready to ship.' :
                                        'Your consolidated shipments will appear here.'}
                            </p>
                        </div>
                    )}

                    {/* Warehouse Info Banner */}
                    {activeTab === 'warehouse' && filtered.length > 0 && (
                        <div className="bg-blue-50 text-brand-blue p-4 rounded-2xl mb-4 flex gap-3 text-xs sm:text-sm font-medium items-start">
                            <Info size={18} className="shrink-0 mt-0.5" />
                            <p>Select items below to bundle them into a single shipment. Shipping is cheaper when you consolidate!</p>
                        </div>
                    )}

                    {/* Items List */}
                    {filtered.map((item) => (
                        <div key={item.id}
                            className={`bg-white p-5 rounded-[24px] border shadow-sm transition-all relative overflow-hidden group
                                ${activeTab === 'warehouse' && selectedIds.has(item.id) ? 'border-brand-blue ring-1 ring-brand-blue bg-blue-50/20' : 'border-slate-100'}`}
                            onClick={() => activeTab === 'warehouse' && toggleSelection(item.id)}
                        >
                            {/* Checkbox for Warehouse */}
                            {activeTab === 'warehouse' && (
                                <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${selectedIds.has(item.id) ? 'bg-brand-blue border-brand-blue' : 'border-slate-300 bg-white'}`}>
                                    {selectedIds.has(item.id) && <CheckCircle size={14} className="text-white" />}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4 pr-8">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                        ${item.type === 'Shop' ? 'bg-purple-50 text-purple-600' :
                                            item.type === 'Procurement' ? 'bg-orange-50 text-orange-600' :
                                                'bg-blue-50 text-brand-blue'}`}>
                                        {item.type === 'Shop' ? <ShoppingBag size={20} /> :
                                            item.type === 'Procurement' ? <ShoppingCart size={20} /> :
                                                <Truck size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">{item.item}</h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.date && (
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                    <Calendar size={10} /> {item.date}
                                                </span>
                                            )}
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold truncate max-w-[150px]">
                                                {item.type === 'Shop' ? 'Shop Order' :
                                                    item.type === 'Procurement' ? 'Request' :
                                                        item.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                                    <span className={item.progress >= 100 ? 'text-green-600' : 'text-brand-blue'}>{item.status}</span>
                                    {item.tab === 'shipment' && <span>{item.progress}%</span>}
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${item.progress >= 100 ? 'bg-green-500' : 'bg-brand-blue'}`}
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions / Tracking */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 relative col-span-2 sm:col-span-1">
                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">Ref / Tracking</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-slate-700 text-xs truncate">{item.trackingId || item.ref}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCopy(item.trackingId || item.ref); }}
                                            className="text-slate-400 hover:text-brand-blue"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* Track Button ONLY for Shipments */}
                                {item.tab === 'shipment' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openMap(item); }}
                                        className="bg-brand-blue text-white rounded-xl p-3 font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20 col-span-2 sm:col-span-1"
                                    >
                                        <MapPin size={14} />
                                        Track
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button for Warehouse */}
            {activeTab === 'warehouse' && selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-6 right-6 z-20 animate-in slide-in-from-bottom-5 duration-300">
                    <button
                        onClick={handleShipSelected}
                        disabled={isShipping}
                        className="w-full bg-brand-blue text-white py-4 rounded-2xl shadow-xl shadow-brand-blue/30 font-bold text-lg flex items-center justify-center gap-2"
                    >
                        {isShipping ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Ship size={24} />
                                Ship {selectedIds.size} Item{selectedIds.size !== 1 && 's'}
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Map Modal */}
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
                            >
                                <Box size={18} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Current Location</h3>
                            <p className="text-slate-500 text-sm mb-6">Package is currently passing through logistics hub near {selectedShipment.origin}.</p>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 text-center">
                                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Estimated Arrival</div>
                                    <div className="text-xl font-bold text-brand-blue">{selectedShipment.eta || "TBD"}</div>
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
