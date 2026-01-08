"use client";

import { X, Search, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logCall, getCustomers } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LogCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TOPICS = ["Inquiry", "Complaint", "Tracking", "Quote", "Other"];
const OUTCOMES = ["Resolved", "Pending", "Urgent", "Follow-up"];

export default function LogCallModal({ isOpen, onClose }: LogCallModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [isCustomerSelectOpen, setCustomerSelectOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getCustomers().then(res => {
                if (res.success) setCustomers(res.data);
            }).catch(err => console.error("GetCustomers failed", err));
        }
    }, [isOpen]);

    // Form State
    const [formData, setFormData] = useState({
        customerName: "",
        phoneNumber: "",
        topic: "Inquiry",
        summary: "",
        outcome: "Pending"
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await logCall(formData);
            setLoading(false);
            if (res.success) {
                setFormData({ customerName: "", phoneNumber: "", topic: "Inquiry", summary: "", outcome: "Pending" });
                onClose();
            }
        } catch (e) {
            console.error("LogCall failed", e);
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Bottom Sheet - Floating Minimal */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-4 left-0 right-0 w-[95%] md:max-w-lg mx-auto bg-white rounded-[32px] p-6 z-[70] shadow-2xl h-auto max-h-[85vh] flex flex-col border border-slate-100"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0" />

                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
                                Log New Call
                            </h2>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-5 pb-4 no-scrollbar">
                            {/* Customer Info */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Details</label>

                                {/* Customer Select */}
                                <div className="relative z-50">
                                    <button
                                        onClick={() => setCustomerSelectOpen(!isCustomerSelectOpen)}
                                        className="w-full p-3 bg-slate-50 rounded-xl text-sm font-normal text-left flex justify-between items-center text-slate-700 focus:ring-2 ring-brand-blue/20 outline-none transition-all"
                                    >
                                        <span className={!formData.customerName ? "text-slate-400" : ""}>
                                            {formData.customerName || "Select a Customer..."}
                                        </span>
                                        <Search size={18} className="text-slate-400" />
                                    </button>

                                    <AnimatePresence>
                                        {isCustomerSelectOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto z-50 no-scrollbar"
                                            >
                                                {customers.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                customerName: c.name || c.email,
                                                                phoneNumber: c.phone || ""
                                                            });
                                                            setCustomerSelectOpen(false);
                                                        }}
                                                        className="w-full p-3 text-left text-sm hover:bg-slate-50 text-slate-700 transition-colors flex flex-col border-b border-slate-50 last:border-0"
                                                    >
                                                        <span className="font-medium text-slate-800">{c.name || c.email}</span>
                                                        <span className="text-xs text-slate-400">{c.email}</span>
                                                    </button>
                                                ))}
                                                {customers.length === 0 && (
                                                    <div className="p-4 text-center text-sm text-slate-400">
                                                        No customers found
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-normal focus:ring-2 ring-brand-blue/20 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-normal focus:ring-2 ring-brand-blue/20 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                />
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topic</label>
                                <div className="flex flex-wrap gap-2">
                                    {TOPICS.map(topic => (
                                        <button
                                            key={topic}
                                            onClick={() => setFormData({ ...formData, topic })}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.topic === topic
                                                ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 scale-105"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</label>
                                <textarea
                                    placeholder="What was discussed?"
                                    rows={4}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-normal focus:ring-2 ring-brand-blue/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                                />
                            </div>

                            {/* Outcome */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outcome</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {OUTCOMES.map(outcome => (
                                        <button
                                            key={outcome}
                                            onClick={() => setFormData({ ...formData, outcome })}
                                            className={`p-3 rounded-xl text-sm font-medium transition-all border ${formData.outcome === outcome
                                                ? "border-brand-pink text-brand-pink bg-brand-pink/5"
                                                : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            {outcome}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-brand-pink text-white font-bold text-lg shadow-xl shadow-brand-pink/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving..." : "Save Log"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
