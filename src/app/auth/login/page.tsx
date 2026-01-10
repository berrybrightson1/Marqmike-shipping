"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "@/app/actions/auth";
import { toast } from "sonner";
import PhoneInput from "@/components/auth/PhoneInput";

import { useSearchParams } from "next/navigation";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Login Method State
    const [loginMethod, setLoginMethod] = useState<'phone' | 'username'>('phone');
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    // Validation State
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const validatePhone = (number: string) => {
        // Remove spaces and non-digits
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

        // Default strictness
        return cleanNum.length >= 10;
    };

    const triggerError = (message: string) => {
        setError(message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setError(null), 2000);
    };


    const handleLogin = async () => {
        let identifier = "";

        if (loginMethod === 'phone') {
            // Strict Phone Validation
            if (!phone || !validatePhone(phone)) {
                triggerError("Invalid Number");
                return;
            }
            identifier = phone;
        } else {
            // Username Validation
            if (!username.trim()) {
                triggerError("Enter Username");
                return;
            }
            identifier = username.trim();
        }

        setLoading(true);

        // Sign in using the identifier (phone or username check against phone column)
        const result = await signIn(identifier);

        if (result.success) {
            toast.success("Welcome back!");
            if (result.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        } else {
            // Smart Redirect if account not found
            if (loginMethod === 'phone' && result.error && result.error.includes("Account not found")) {
                triggerError("Not Registered");
                setTimeout(() => {
                    router.push(`/auth/signup?phone=${encodeURIComponent(phone)}`);
                }, 1500);
            } else {
                triggerError(result.error || "Failed to Login");
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
                style={{ minHeight: '600px' }}
            >
                {/* Blue Header - Like Dashboard */}
                <div className="bg-brand-blue pt-12 pb-24 px-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center relative z-10"
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-5">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg p-3">
                                <img
                                    src="/logos/marqmike-white-logo.svg"
                                    alt="Marqmike Logistics"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-white/80 text-base">Sign in to continue</p>
                    </motion.div>
                </div>

                {/* White Content Area */}
                <div className="bg-white px-8 pb-10 pt-8 -mt-16 relative z-10 rounded-t-3xl min-h-[400px]">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Login Method Toggle */}
                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                            <button
                                onClick={() => setLoginMethod('phone')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'phone'
                                    ? "bg-white text-brand-blue shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                Phone Number
                            </button>
                            <button
                                onClick={() => setLoginMethod('username')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'username'
                                    ? "bg-white text-brand-blue shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                Username
                            </button>
                        </div>

                        <div className="min-h-[80px]">
                            {loginMethod === 'phone' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    key="phone-input"
                                >
                                    <label className="text-slate-700 font-bold text-sm mb-3 block">
                                        Phone Number
                                    </label>
                                    <PhoneInput
                                        value={phone}
                                        onChange={setPhone}
                                        onEnter={handleLogin}
                                        disabled={loading}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key="username-input"
                                >
                                    <label className="text-slate-700 font-bold text-sm mb-3 block">
                                        Username / ID
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Shield size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                            disabled={loading}
                                            placeholder="Enter admin username"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Shake System Button */}
                        <motion.button
                            onClick={handleLogin}
                            disabled={loading || (loginMethod === 'phone' && !!error)}
                            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`
                                w-full py-4 rounded-xl font-bold font-lg shadow-lg transition-all flex items-center justify-center gap-2 group mt-4
                                ${error
                                    ? "bg-red-500 text-white shadow-red-500/25 cursor-not-allowed"
                                    : "bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white shadow-brand-blue/25 hover:from-brand-blue/90 hover:to-brand-blue"
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
                                    Sign In
                                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center text-sm text-slate-600 pt-2">
                            Don't have an account?{" "}
                            <a href="/auth/signup" className="text-brand-blue hover:text-brand-pink font-bold transition-colors">
                                Sign up
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-8 mt-8 border-t border-slate-100">
                            <div className="flex justify-center gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                                        <Shield className="text-brand-blue" size={16} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-600">Secure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                                        <Zap className="text-brand-blue" size={16} />
                                    </div>
                                    <span className="text-xs font-medium text-slate-600">Fast</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="pt-6 mt-2">
                            <div className="flex justify-center gap-6 text-center">
                                <div>
                                    <p className="text-brand-blue font-bold text-lg">180+</p>
                                    <p className="text-slate-500 text-xs">Countries</p>
                                </div>
                                <div>
                                    <p className="text-brand-blue font-bold text-lg">24/7</p>
                                    <p className="text-slate-500 text-xs">Support</p>
                                </div>
                                <div>
                                    <p className="text-brand-blue font-bold text-lg">10K+</p>
                                    <p className="text-slate-500 text-xs">Users</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
