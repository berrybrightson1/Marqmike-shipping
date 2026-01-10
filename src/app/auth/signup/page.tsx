"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import PhoneInput from "@/components/auth/PhoneInput";

import { useSearchParams } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [loading, setLoading] = useState(false);

    // Validation State
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const validatePhone = (number: string) => {
        // Remove spaces and non-digits just in case
        const cleanNum = number.replace(/\D/g, "");

        // Ghana: 233 + 9 digits = 12
        if (cleanNum.startsWith("233")) return cleanNum.length === 12;
        // Nigeria: 234 + 10 digits = 13
        if (cleanNum.startsWith("234")) return cleanNum.length === 13;
        // USA: 1 + 10 digits = 11
        if (cleanNum.startsWith("1")) return cleanNum.length === 11;
        // UK: 44 + 10 digits = 12
        if (cleanNum.startsWith("44")) return cleanNum.length === 12;
        // Kenya: 254 + 9 digits = 12
        if (cleanNum.startsWith("254")) return cleanNum.length === 12;

        // Default strictness for others: at least 10 digits
        return cleanNum.length >= 10;
    };

    const triggerError = (message: string) => {
        setError(message);
        setShake(true);
        setTimeout(() => setShake(false), 500); // Shake duration

        // Reset error text after 2 seconds
        setTimeout(() => setError(null), 2000);
    };

    const handleSignup = async () => {
        // Strict Name Validation
        if (!name.trim() || name.trim().split(" ").length < 2) {
            triggerError("Enter Full Name");
            return;
        }

        // Business Name Validation
        if (!businessName.trim()) {
            triggerError("Enter Business Name");
            return;
        }

        // Strict Phone Validation
        if (!phone || !validatePhone(phone)) {
            triggerError("Invalid Number");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("businessName", businessName);
        formData.append("phone", phone);

        const result = await signUp(formData);

        if (result.success) {
            toast.success("Welcome to Marqmike! 🎉");
            router.push("/dashboard");
        } else {
            // Smart Redirect if account exists
            if (result.error && result.error.includes("Account already exists")) {
                triggerError("Account Exists");
                // Brief delay to let user see the error, then redirect
                setTimeout(() => {
                    router.push(`/auth/login?phone=${encodeURIComponent(phone)}`);
                }, 1500);
            } else {
                triggerError("Failed to Create");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#F2F6FC] to-white flex flex-col justify-center items-center px-6 py-8 relative overflow-hidden">
            {/* Subtle Background Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl" />

            {/* Mobile Phone Frame */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
                style={{ minHeight: '700px' }}
            >
                {/* Pink Header */}
                <div className="bg-brand-pink pt-12 pb-32 px-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center relative z-10"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">Join Marqmike</h2>
                        <p className="text-white/80 text-base">Start shipping today</p>
                    </motion.div>
                </div>

                <div className="bg-white px-8 pb-10 pt-8 -mt-20 relative z-10 rounded-t-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="pt-2">
                            <label className="text-slate-700 font-bold text-sm mb-3 block">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                                placeholder="John Doe"
                                disabled={loading}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink/50 transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="text-slate-700 font-bold text-sm mb-3 block">
                                Business Name
                            </label>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                                placeholder="e.g. Berry's Boutique"
                                disabled={loading}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink/50 transition-all disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="text-slate-700 font-bold text-sm mb-3 block">
                                Phone Number
                            </label>
                            <PhoneInput
                                value={phone}
                                onChange={setPhone}
                                onEnter={handleSignup}
                                disabled={loading}
                            />
                        </div>

                        {/* Shake System Button */}
                        <motion.button
                            onClick={handleSignup}
                            disabled={loading || !!error}
                            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`
                                w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group
                                ${error
                                    ? "bg-red-500 text-white shadow-red-500/25 cursor-not-allowed"
                                    : "bg-brand-pink text-white shadow-brand-pink/25 hover:shadow-xl hover:bg-brand-pink/90"
                                }
                                ${loading ? "opacity-75 cursor-wait" : ""}
                            `}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : error ? (
                                <>
                                    {error}
                                </>
                            ) : (
                                <>
                                    Get Started
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center text-sm text-slate-600 pt-2">
                            Already have an account?{" "}
                            <a href="/auth/login" className="text-brand-pink hover:text-white font-bold transition-colors">
                                Sign in
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
