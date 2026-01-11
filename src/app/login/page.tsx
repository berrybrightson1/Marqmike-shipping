"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn, setInitialPassword } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requiresSetup, setRequiresSetup] = useState(false); // Mode for first-time password setup
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (requiresSetup) {
            // Handle Password Creation
            const res = await setInitialPassword(phone, password);
            if (res.success) {
                toast.success("Password set successfully! Logging in...");
                router.push("/dashboard");
            } else {
                toast.error(res.error || "Failed to set password");
            }
        } else {
            // Handle Normal Login
            const res = await signIn(phone, password);
            if (res.success) {
                toast.success("Welcome back!");
                router.push("/dashboard");
            } else if (res.code === "REQUIRE_PASSWORD_SETUP") {
                setRequiresSetup(true);
                setPassword(""); // Clear for new password entry
                toast.info("Please create a password for your account.");
            } else {
                toast.error(res.error || "Login failed");
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-brand-blue">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-pink/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="p-8 md:p-10 border-white/20">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-brand-blue mb-2">
                            {requiresSetup ? "Create Password" : "Welcome Back"}
                        </h1>
                        <p className="text-slate-500">
                            {requiresSetup
                                ? "Set a password to secure your existing account"
                                : "Sign in to manage your shipments"}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            {/* Removed Label as requested */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone size={20} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (054 123 4567)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    // Disable phone editing in setup mode to ensure we set password for correct user
                                    readOnly={requiresSetup}
                                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all ${requiresSetup ? 'opacity-70 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={requiresSetup ? "Create New Password" : "Password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {!requiresSetup && (
                                <div className="flex justify-end pt-1">
                                    <button type="button" onClick={() => toast.info("Please contact admin to reset your password")} className="text-xs font-bold text-brand-pink hover:underline">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue hover:bg-[#003d91] text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">Processing...</span>
                            ) : (
                                <>
                                    {requiresSetup ? "Set Password & Login" : "Sign In"}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {!requiresSetup && (
                        <div className="mt-8 text-center text-sm text-slate-400">
                            <p className="mb-4">Don't have an account?</p>
                            <Link href="/signup" className="font-bold text-brand-blue hover:underline">
                                Create Account
                            </Link>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
