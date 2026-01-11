"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, User, Briefcase, Mail, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";

function SignupPageContent() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !phone || !password) {
            toast.error("Please fill in all required fields (Name, Phone, Password)");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("businessName", businessName);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("password", password);

        const result = await signUp(formData);

        if (result.success) {
            toast.success("Welcome to Marqmike! 🎉");
            router.push("/dashboard");
        } else {
            toast.error(result.error || "Failed to create account");
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
                        <h1 className="text-3xl font-bold text-brand-blue mb-2">Join Marqmike</h1>
                        <p className="text-slate-500">Start shipping worldwide today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">

                        {/* Name */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name (John Doe)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            />
                        </div>

                        {/* Business */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Briefcase size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Business Name (Optional)"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address (john@example.com)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Phone size={20} />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number (054 123 4567)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue hover:bg-[#003d91] text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 group mt-6"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        <p className="mb-4">Already have an account?</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="font-bold text-brand-blue hover:underline"
                        >
                            Sign In
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-blue"><Loader2 className="animate-spin text-white" /></div>}>
            <SignupPageContent />
        </Suspense>
    );
}
