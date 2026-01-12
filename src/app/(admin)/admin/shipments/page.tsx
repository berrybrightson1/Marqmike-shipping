"use client";

import { getAllShipments, updateShipmentStatus } from "@/app/actions/shipment";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, MoreVertical, Package, MapPin, Loader2, Edit2, Ban, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner"; // Assuming sonner is installed, if not we'll allow standard alert or implement later
import CreateShipmentModal from "@/components/admin/CreateShipmentModal";
import DataFilter from "@/components/admin/DataFilter";
import { notifyShipmentUpdate } from "@/lib/notifications";

export default function ShipmentManagerPage() {
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<{ status: string[] }>({ status: [] });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        loadShipments();
    }, []);

    const loadShipments = async () => {
        try {
            const res = await getAllShipments();
            if (res.success) {
                setShipments(res.data);
            }
        } catch (error) {
            toast.error("Failed to load shipments");
        } finally {
            setLoading(false);
        }
    };

    const filteredShipments = shipments.filter(s => {
        const matchesSearch = (s.trackingId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (s.customerName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status.length === 0 || filters.status.includes(s.status);
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = async (trackingId: string, newStatus: string) => {
        // Optimistic update
        setShipments(prev => prev.map(s => s.trackingId === trackingId ? { ...s, status: newStatus } : s));

        const res = await updateShipmentStatus(trackingId, newStatus);
        if (res.success) {
            toast.success(`Shipment ${trackingId} updated to ${newStatus}`);
            // Trigger Notification
            notifyShipmentUpdate(trackingId, newStatus, "+233555555555", "customer@example.com");
        } else {
            toast.error("Failed to update status");
            loadShipments(); // Revert on failure
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 h-screen overflow-y-auto pb-20 bg-[#F2F6FC]">
            <CreateShipmentModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); loadShipments(); }}
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Shipment Manager</h1>
                    <p className="text-slate-500 mt-1">Manage global logistics and waybills.</p>
                </div>
                <div className="flex gap-3">
                    <DataFilter onFilterChange={(newFilters: any) => setFilters(prev => ({ ...prev, ...newFilters }))} />
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-brand-blue text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] transition-all flex items-center gap-2 hover:shadow-brand-blue/40"
                    >
                        <Package size={18} /> New Shipment
                    </button>
                </div>
            </header>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search Tracking ID, Customer..."
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 ring-brand-blue/20 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                                <th className="p-6">Tracking ID</th>
                                <th className="p-6">Customer</th>
                                <th className="p-6">Route</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Loader2 className="animate-spin text-brand-blue mx-auto" size={24} />
                                    </td>
                                </tr>
                            ) : filteredShipments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400">
                                        No shipments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredShipments.map((shipment) => (
                                    <tr key={shipment.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="p-6">
                                            <span className="font-mono font-bold text-brand-blue flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-brand-pink"></div>
                                                {shipment.trackingId}
                                            </span>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 pl-4">Standard Shipping</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-bold text-slate-700">{shipment.receipientName || shipment.customerName || "N/A"}</div>
                                            <div className="text-xs text-slate-400">Shipper: {shipment.shipperName}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <span className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-bold">{shipment.origin || "CN"}</span>
                                                <div className="w-8 h-[2px] bg-slate-200 relative">
                                                    <div className="absolute right-0 -top-[3px] w-2 h-2 bg-slate-200 rounded-full" />
                                                </div>
                                                <span className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-bold">{shipment.destination || "GH"}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <StatusDropdown
                                                currentStatus={shipment.status}
                                                onUpdate={(val) => handleStatusUpdate(shipment.trackingId, val)}
                                            />
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-100">
                                                <button
                                                    onClick={() => {
                                                        // TODO: Implement Edit - For now just toast
                                                        toast.info("Edit functionality coming in next update");
                                                    }}
                                                    title="View/Edit"
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(shipment.trackingId, "Cancelled")}
                                                    title="Disable/Cancel"
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete shipment ${shipment.trackingId}?`)) {
                                                            // For now using native confirm, ideally switch to ConfirmModal
                                                            // Simulate delete
                                                            setShipments(prev => prev.filter(s => s.id !== shipment.id));
                                                            toast.success("Shipment deleted");
                                                        }
                                                    }}
                                                    title="Delete"
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusDropdown({ currentStatus, onUpdate }: { currentStatus: string, onUpdate: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const statuses = ["Received", "In Transit", "Arrived", "Cleared", "Out for Delivery", "Delivered"];
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'Out for Delivery': return 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
            case 'In Transit': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Arrived': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Received': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Cleared': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${getStatusStyle(currentStatus)}`}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'Delivered' ? 'bg-green-500' :
                    currentStatus === 'Out for Delivery' ? 'bg-brand-blue' :
                        currentStatus === 'In Transit' ? 'bg-orange-500' :
                            currentStatus === 'Arrived' ? 'bg-purple-500' :
                                currentStatus === 'Cleared' ? 'bg-cyan-500' : 'bg-slate-500'}`} />
                {currentStatus}
                <ChevronDown size={12} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/20 py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1.5">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => {
                                onUpdate(status);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 mb-1 last:mb-0
                                ${status === 'Delivered' ? 'text-green-700 hover:bg-green-50' :
                                    status === 'Out for Delivery' ? 'text-brand-blue hover:bg-blue-50' :
                                        status === 'In Transit' ? 'text-orange-700 hover:bg-orange-50' :
                                            status === 'Arrived' ? 'text-purple-700 hover:bg-purple-50' :
                                                status === 'Cleared' ? 'text-cyan-700 hover:bg-cyan-50' :
                                                    'text-slate-600 hover:bg-slate-100'}
                                ${status === currentStatus ? 'bg-white shadow-sm ring-1 ring-slate-100' : ''}
                            `}
                        >
                            <div className={`w-2 h-2 rounded-full shadow-sm ${status === 'Delivered' ? 'bg-green-500' :
                                status === 'Out for Delivery' ? 'bg-brand-blue' :
                                    status === 'In Transit' ? 'bg-orange-500' :
                                        status === 'Arrived' ? 'bg-purple-500' :
                                            status === 'Cleared' ? 'bg-cyan-500' : 'bg-slate-400'}`} />
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
