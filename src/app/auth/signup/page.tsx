"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import PhoneInput from "@/components/auth/PhoneInput";

function SignupPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);

    const validatePhone = (number: string) => {
        const cleanNum = number.replace(/\D/g, "");
        if (cleanNum.startsWith("233")) return cleanNum.length === 12;
        if (cleanNum.startsWith("234")) return cleanNum.length === 13;
        if (cleanNum.startsWith("1")) return cleanNum.length === 11;
        if (cleanNum.startsWith("44")) return cleanNum.length === 12;
        if (cleanNum.startsWith("254")) return cleanNum.length === 12;
        return cleanNum.length >= 10;
    };

    const triggerError = (message: string) => {
        setError(message);
        setShake(shake => !shake);
        setTimeout(() => setError(null), 2000);
    };

    const handleSignup = async () => {
        if (!name.trim() || name.trim().split(" ").length < 2) {
            triggerError("Enter Full Name");
            return;
        }
        if (!businessName.trim()) {
            triggerError("Enter Business Name");
            return;
        }
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
            if (result.error?.includes("Account already exists")) {
                triggerError("Account Exists");
                setTimeout(() => router.push(`/auth/login?phone=${encodeURIComponent(phone)}`), 1500);
            } else {
                triggerError("Failed to Create");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#074eaf] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decorative Element */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ff1493]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[150px]" />

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

                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Join Marqmike</h2>
                    <p className="text-white/90 font-bold tracking-tight">Start shipping around the world today</p>
                </div>

                <div className="w-full space-y-6">
                    <div className="space-y-4">
                        <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                disabled={loading}
                                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[28px] h-[60px] pl-16 pr-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-white/20 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-1">
                            Business / Company Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                                <Briefcase size={20} />
                            </div>
                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Logistics Express"
                                disabled={loading}
                                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[28px] h-[60px] pl-16 pr-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-white/20 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-1">
                            Phone Number
                        </label>
                        <div className="p-1">
                            <PhoneInput
                                value={phone}
                                onChange={setPhone}
                                onEnter={handleSignup}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <motion.button
                        onClick={handleSignup}
                        disabled={loading || !!error}
                        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        className={`
                            w-full h-18 py-5 rounded-[22px] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl mt-4
                            ${error
                                ? "bg-red-500 text-white"
                                : "bg-[#ff1493] text-white hover:scale-[1.02] active:scale-[0.98] shadow-[#ff1493]/20"
                            }
                            ${loading ? "opacity-75 cursor-wait" : ""}
                        `}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : error ? (
                            error
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={22} strokeWidth={3} />
                            </>
                        )}
                    </motion.button>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-white/30 text-sm font-medium">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="text-[#ff1493] font-black hover:underline underline-offset-4"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#074eaf]"><Loader2 className="animate-spin text-white" /></div>}>
            <SignupPageContent />
        </Suspense>
    );
}
