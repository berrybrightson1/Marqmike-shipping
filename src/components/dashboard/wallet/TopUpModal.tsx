"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TopUpModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"card" | "momo">("card");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setAmount("");
            onClose();
            toast.success("Wallet topped up successfully!");
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Top Up Wallet</h2>
                                    <p className="text-sm text-slate-500">Add funds to your account.</p>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {success ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Success!</h3>
                                    <p className="text-slate-500">Your wallet has been credited.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleTopUp} className="p-6 space-y-6">
                                    {/* Amount Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Amount (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setMethod("card")}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-brand-blue bg-blue-50/50 text-brand-blue' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <CreditCard size={24} />
                                                <span className="text-xs font-bold">Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMethod("momo")}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'momo' ? 'border-brand-blue bg-blue-50/50 text-brand-blue' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                            >
                                                <Smartphone size={24} />
                                                <span className="text-xs font-bold">Mobile Money</span>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl font-bold bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-[#003d91] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : `Pay $${amount || '0.00'}`}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
