"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate network delay for realism
        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-brand-blue">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-pink/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <GlassCard className="p-8 md:p-10 border-white/20">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-brand-blue mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to manage your shipments</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    aria-label="Email Address"
                                    defaultValue="demo@marqmike.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    aria-label="Password"
                                    defaultValue="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue hover:bg-[#003d91] text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        <p className="mb-4">Or continue with</p>
                        <div className="flex justify-center gap-4">
                            <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 opacity-60" />
                            </button>
                            <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <span className="font-bold text-slate-600">A</span>
                            </button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
