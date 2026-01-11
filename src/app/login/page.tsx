"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, setInitialPassword, signInAsAdmin } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import PhoneInput from "@/components/auth/PhoneInput";
import BannerSlider from "@/components/auth/BannerSlider";
import { Lock, Eye, EyeOff, ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requiresSetup, setRequiresSetup] = useState(false);

    // Auth State
    const [loginMethod, setLoginMethod] = useState<'PHONE' | 'ADMIN'>('PHONE');
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (loginMethod === 'ADMIN') {
                // Admin Login Flow (Password Only)
                const res = await signInAsAdmin(password);
                if (res.success) {
                    toast.success("Admin Access Granted");
                    router.push("/admin/dashboard"); // Redirect to Admin Dashboard
                } else {
                    toast.error(res.error || "Access Denied");
                }
            } else {
                // Regular User Login Flow
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
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <ChevronLeft size={32} />
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm flex flex-col items-center"
            >
                {/* Banner Slider */}
                <BannerSlider />

                {/* Header */}
                <h1 className="text-4xl font-black text-white text-center mb-2">
                    {loginMethod === 'ADMIN' ? "Admin Access" : (requiresSetup ? "Create Password" : "Welcome Back")}
                </h1>
                <p className="text-white/80 text-center mb-10 font-bold text-sm">
                    {loginMethod === 'ADMIN' ? "Authorized personnel only" : (requiresSetup ? "Secure your account" : "Global logistics at your fingertips")}
                </p>

                {/* Toggle Switch */}
                <div className="bg-[#003d91]/50 p-1 rounded-3xl flex w-full mb-8 relative">
                    <button
                        onClick={() => { setLoginMethod('PHONE'); setPassword(""); }}
                        className={`flex-1 font-black py-3 rounded-3xl text-sm transition-all ${loginMethod === 'PHONE' ? 'bg-white text-[#074eaf] shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        User
                    </button>
                    <button
                        onClick={() => { setLoginMethod('ADMIN'); setPassword(""); }}
                        className={`flex-1 font-black py-3 rounded-3xl text-sm transition-all ${loginMethod === 'ADMIN' ? 'bg-white text-[#074eaf] shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                        Admin
                    </button>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-6">

                    <AnimatePresence mode="wait">
                        {loginMethod === 'PHONE' && (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                                    Active Phone Number
                                </label>
                                <div className="bg-[#003d91]/60 rounded-3xl overflow-hidden border border-white/5 focus-within:ring-2 focus-within:ring-brand-pink/50 transition-all">
                                    <PhoneInput
                                        value={phone}
                                        onChange={setPhone}
                                        disabled={loading || requiresSetup}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password Input (Shared but labeled differently) */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">
                            {loginMethod === 'ADMIN' ? 'Admin Key' : 'Password'}
                        </label>
                        <div className="relative bg-[#003d91]/60 rounded-3xl border border-white/5 focus-within:ring-2 focus-within:ring-brand-pink/50 transition-all">
                            {loginMethod === 'ADMIN' && (
                                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                            )}
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full h-16 bg-transparent border-none text-white text-lg font-bold px-6 focus:outline-none placeholder:text-white/20 ${loginMethod === 'ADMIN' ? 'pl-16' : ''}`}
                                placeholder={loginMethod === 'ADMIN' ? "Enter admin key" : (requiresSetup ? "Create a password" : "Enter your password")}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link (Only for User) */}
                    {loginMethod === 'PHONE' && !requiresSetup && (
                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-xs font-bold text-white hover:text-white/80 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-[#ff1493] hover:bg-[#d10f7a] text-white rounded-3xl font-black text-lg shadow-xl shadow-[#ff1493]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? "Processing..." : (loginMethod === 'ADMIN' ? "Access Dashboard" : (requiresSetup ? "Set Password" : "Sign In"))}
                        {!loading && <ArrowRight size={22} strokeWidth={3} />}
                    </button>

                </form>

                {/* Footer (Only for User) */}
                {loginMethod === 'PHONE' && (
                    <div className="mt-12 flex items-center gap-4 w-full justify-center pt-8 border-t border-white/10">
                        <span className="text-white/60 font-bold text-sm">New to Marqmike?</span>
                        <Link href="/signup">
                            <button className="bg-white/10 text-white px-6 py-2 rounded-2xl font-black text-xs hover:bg-white hover:text-[#074eaf] transition-colors uppercase tracking-wide">
                                Create Account
                            </button>
                        </Link>
                    </div>
                )}

            </motion.div>
        </div>
    );
}
