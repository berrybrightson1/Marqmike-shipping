"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "@/app/actions/auth";
import { toast } from "sonner";
import PhoneInput from "@/components/auth/PhoneInput";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'username'>('phone');
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const validatePhone = (number: string) => {
        const cleanNum = number.replace(/\D/g, "");
        if (cleanNum.startsWith("233")) return cleanNum.length === 12;
        if (cleanNum.startsWith("234")) return cleanNum.length === 13;
        if (cleanNum.startsWith("1")) return cleanNum.length === 11;
        return cleanNum.length >= 10;
    };

    const triggerError = (message: string) => {
        setError(message);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setError(null), 3000);
    };

    const handleLogin = async () => {
        let identifier = "";
        if (loginMethod === 'phone') {
            if (!phone || !validatePhone(phone)) {
                triggerError("Invalid Number");
                return;
            }
            identifier = phone;
        } else {
            if (!username.trim()) {
                triggerError("Enter Username");
                return;
            }
            identifier = username.trim();
        }

        setLoading(true);
        setError(null);

        try {
            const result = await signIn(identifier);

            if (result.success) {
                toast.success("Welcome back!");
                router.push(result.role === "ADMIN" ? "/admin" : "/dashboard");
            } else {
                triggerError(result.error || "Failed to Login");
            }
        } catch (err) {
            triggerError("Connection Error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full bg-[#074eaf] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Element */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff1493]/10 rounded-full blur-[120px]" />

            {/* Seamless Content Alignment */}
            <div className="w-full max-w-md flex flex-col items-center relative z-10">

                {/* Ultra Massive Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16 md:mb-24"
                >
                    <img
                        src="/logos/marqmike-white-logo.svg"
                        alt="Marqmike"
                        className="h-44 md:h-64 w-auto cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => router.push("/")}
                    />
                </motion.div>

                <div className="w-full text-center mb-12">
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h2>
                    <p className="text-white/90 font-bold tracking-tight">Global logistics at your fingertips</p>
                </div>

                <div className="w-full space-y-8">
                    {/* Method Toggle */}
                    <div className="flex p-1.5 bg-white/5 backdrop-blur-md rounded-[28px] border border-white/10">
                        <button
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-4 text-sm font-black rounded-[24px] transition-all ${loginMethod === 'phone'
                                ? "bg-white text-[#074eaf] shadow-xl"
                                : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            Phone Number
                        </button>
                        <button
                            onClick={() => setLoginMethod('username')}
                            className={`flex-1 py-4 text-sm font-black rounded-[24px] transition-all ${loginMethod === 'username'
                                ? "bg-white text-[#074eaf] shadow-xl"
                                : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            Username
                        </button>
                    </div>

                    <div className="min-h-[100px]">
                        <AnimatePresence mode="wait">
                            {loginMethod === 'phone' ? (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-1">
                                        Active Phone Number
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
                                    key="username"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-1">
                                        Staff Username / ID
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                            <Shield size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                            disabled={loading}
                                            placeholder="MQM-ADMIN-..."
                                            className="w-full bg-white/5 border border-white/10 rounded-[28px] h-20 pl-16 pr-6 font-mono text-lg text-white placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-white/5 transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        onClick={handleLogin}
                        disabled={loading}
                        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`
                            w-full h-20 rounded-[28px] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl
                            ${error
                                ? "bg-red-500 shadow-red-500/20"
                                : "bg-[#ff1493] hover:scale-[1.02] active:scale-[0.98] shadow-[#ff1493]/20"
                            }
                            text-white
                            ${loading ? "opacity-75 cursor-wait" : ""}
                        `}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : error ? (
                            error
                        ) : (
                            <>
                                Sign In to Dashboard
                                <ArrowRight size={22} strokeWidth={3} />
                            </>
                        )}
                    </motion.button>

                    <div className="flex flex-col items-center gap-4 pt-4">
                        <div className="w-full h-px bg-white/10" />
                        <button
                            onClick={() => router.push("/auth/signup")}
                            className="text-white font-bold hover:text-[#ff1493] transition-colors flex items-center gap-2"
                        >
                            <span>New to Marqmike?</span>
                            <span className="uppercase tracking-[0.1em] text-[12px] bg-white/10 px-3 py-1 rounded-full">Create Account</span>
                        </button>
                    </div>
                </div>

                <div className="mt-16 text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                    <span>Secure</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span>Instant</span>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#074eaf]"><Loader2 className="animate-spin text-white" /></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
