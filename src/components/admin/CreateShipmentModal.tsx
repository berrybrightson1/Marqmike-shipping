"use client";

import { useState } from "react";
import { X, Package, Ruler, Disc, Box, Loader2, Phone } from "lucide-react";
import { createShipment } from "@/app/actions/shipment";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateShipmentModal({ isOpen, onClose }: Props) {
    const [loading, setLoading] = useState(false);

    // Form Steps or Single Page? Single page for simplicity first.
    // Tracking ID can be auto-generated or manual. Let's allowing manual for now or auto if empty?
    // Start with fully manual.

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Add default status if not present (handled server side but good to know)
        try {
            const res = await createShipment(formData);
            if (res && res.error) {
                toast.error(res.error);
            } else {
                toast.success("Shipment created successfully!");
                onClose();
            }
        } catch (e) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">New Shipment</h2>
                                    <p className="text-sm text-slate-500">Create a new waybill manually.</p>
                                </div>
                                <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Form */}
                            <form action={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Tracking ID</label>
                                    <div className="relative">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            name="trackingId"
                                            required
                                            placeholder="e.g. MQM-8821"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Customer Phone</label>
                                        <input
                                            name="customerPhone"
                                            required
                                            placeholder="+233..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono"
                                        />
                                    </div>
                                    <div>
                                        {/* Spacer or Tracking ID if moved here */}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Shipper</label>
                                        <input
                                            name="shipperName"
                                            required
                                            placeholder="Supplier Name"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Recipient</label>
                                        <input
                                            name="recipientName"
                                            required
                                            placeholder="Receiver Name"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Origin</label>
                                        <div className="relative">
                                            <Disc className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="origin"
                                                required
                                                defaultValue="Guangzhou"
                                                placeholder="City"
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Destination</label>
                                        <div className="relative">
                                            <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="destination"
                                                required
                                                defaultValue="Accra"
                                                placeholder="City"
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Banner */}
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-xs font-medium flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <Box size={16} className="text-brand-blue" />
                                    </div>
                                    <p>Shipment will be initialized as <span className="font-bold">Pending</span>. You can update the status to "Received" once items arrive at the warehouse.</p>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-2 flex gap-3">
                                    <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-3.5 rounded-xl font-bold bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Create Shipment"}
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}

// Helper Icon
function MapPinIcon({ className, size }: { className?: string, size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
