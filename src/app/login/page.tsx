"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, setInitialPassword } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import PhoneInput from "@/components/auth/PhoneInput";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requiresSetup, setRequiresSetup] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (requiresSetup) {
                const res = await setInitialPassword(phone, password);
                if (res.success) {
                    toast.success("Password set! Logging in...");
                    router.push("/dashboard");
                } else {
                    toast.error(res.error || "Failed to set password");
                }
            } else {
                const res = await signIn(phone, password);
                if (res.success) {
                    toast.success("Welcome back!");
                    router.push("/dashboard");
                } else if (res.code === "REQUIRE_PASSWORD_SETUP") {
                    setRequiresSetup(true);
                    setPassword("");
                    toast.info("Please create a password for your account");
                } else {
                    toast.error(res.error || "Login failed");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6">

            {/* Background Accents (Subtle) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#ff1493]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-10">
                    <img src="/logos/marqmike-white-logo.svg" alt="Marqmike" className="h-20 w-auto" />
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl">
                    <h1 className="text-3xl font-black text-white text-center mb-2">
                        {requiresSetup ? "Create Password" : "Welcome Back"}
                    </h1>
                    <p className="text-white/60 text-center mb-8 font-medium">
                        {requiresSetup ? "Secure your account to continue" : "Sign in to your account"}
                    </p>

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/80 uppercase tracking-widest ml-4">Phone Number</label>
                            <PhoneInput
                                value={phone}
                                onChange={setPhone}
                                disabled={loading || requiresSetup}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/80 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-[28px] pl-14 pr-14 text-white placeholder:text-white/20 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        {!requiresSetup && (
                            <div className="flex justify-end pr-2">
                                <Link href="/contact" className="text-xs font-bold text-[#ff1493] hover:text-[#ff1493]/80 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-20 bg-[#ff1493] hover:bg-[#d10f7a] text-white rounded-[28px] font-black text-lg shadow-xl shadow-[#ff1493]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? "Processing..." : (requiresSetup ? "Set Password" : "Sign In")}
                            {!loading && <ArrowRight size={24} strokeWidth={3} />}
                        </button>

                    </form>
                </div>

                {/* Footer Links */}
                {!requiresSetup && (
                    <div className="mt-8 text-center">
                        <p className="text-white/40 font-bold mb-4">Don't have an account?</p>
                        <Link href="/signup">
                            <button className="bg-white/10 text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-[#074eaf] transition-all">
                                Create Account
                            </button>
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
