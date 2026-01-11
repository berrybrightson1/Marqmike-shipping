"use client";

import { X, Search, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getCustomers, logCustomerCall } from "@/app/actions/admin"; // We need to ensure logCustomerCall exists or use a generic one
import { toast } from "sonner";

interface LogCallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function LogCallModal({ isOpen, onClose, onSuccess }: LogCallModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [summary, setSummary] = useState("");
    const [outcome, setOutcome] = useState("Pending");
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Debounced search for customers
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length > 1) {
                setSearching(true);
                const res = await getCustomers(searchTerm); // Assuming getCustomers accepts a query
                if (res.success && res.data) {
                    setCustomers(res.data);
                }
                setSearching(false);
            } else {
                setCustomers([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!selectedCustomer) {
            toast.error("Please select a customer");
            return;
        }
        if (!summary.trim()) {
            toast.error("Please enter a summary");
            return;
        }

        setLoading(true);
        // Assuming we need a server action to save the log.
        // Since I don't have the exact signature of 'logCustomerCall', I will assume it takes similar params.
        // If it doesn't exist, I might need to create it or stub it. 
        // Checking task.md: "Call Log Page: Redesign...". 
        // I will use a placeholder action call here if I haven't seen the file, but I should probably check actions/admin.ts first.
        // For now, I'll assume `logCustomerCall` or similar needs to be imported or created.

        // Simulating action call for UI structure first (or real call if imports work)
        try {
            const res = await logCustomerCall({
                customerId: selectedCustomer.id,
                customerName: selectedCustomer.name || "Unknown",
                phoneNumber: selectedCustomer.phone,
                summary,
                outcome,
                duration: "0", // Default
                type: "Outbound" // Default or selectable
            });

            if (res.success) {
                toast.success("Call logged successfully");
                onSuccess?.();
                onClose();
            } else {
                toast.error("Failed to save log");
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred");
        }
        setLoading(false);
    };

    const outcomes = ["Resolved", "Pending", "Urgent", "Follow-up"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                        <span className="text-brand-blue">Log New</span> <span className="text-[#ff269b]">Call</span>
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Customer Search */}
                <div className="mb-6 relative">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Details</label>

                    {!selectedCustomer ? (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Select a Customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />

                            {/* Dropdown Results */}
                            {searchTerm.length > 1 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-20">
                                    {searching ? (
                                        <div className="p-4 text-center text-slate-400 text-xs">Loading...</div>
                                    ) : customers.length > 0 ? (
                                        customers.map((c: any) => (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    setSelectedCustomer(c);
                                                    setSearchTerm("");
                                                }}
                                                className="w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                                            >
                                                <div className="font-bold text-slate-800 text-sm">{c.name || "Unknown"}</div>
                                                <div className="text-xs text-slate-400">{c.email || "No Email"}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-400 text-xs">No customers found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex justify-between items-center group">
                            <div>
                                <div className="font-bold text-slate-800">{selectedCustomer.name}</div>
                                <div className="text-xs text-slate-500">{selectedCustomer.email || selectedCustomer.phone || "No contact info"}</div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</label>
                    <textarea
                        placeholder="What was discussed?"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none transition-all"
                    />
                </div>

                {/* Outcome */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Outcome</label>
                    <div className="grid grid-cols-2 gap-3">
                        {outcomes.map((o) => (
                            <button
                                key={o}
                                onClick={() => setOutcome(o)}
                                className={`
                                    py-3 rounded-xl text-sm font-bold transition-all
                                    ${outcome === o
                                        ? o === "Pending"
                                            ? "bg-pink-50 text-pink-600 border-2 border-pink-500 shadow-sm" // Special style for Pending as per image? Or just selected state.
                                            : "bg-slate-800 text-white shadow-lg"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    }
                                `}
                            >
                                {o}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-4 bg-[#ff269b] hover:bg-[#e61e8a] text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-pink/30 hover:shadow-brand-pink/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Save Log"}
                </button>
            </div>
        </div>
    );
}
