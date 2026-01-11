"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import PhoneInput from "@/components/auth/PhoneInput";
import BannerSlider from "@/components/auth/BannerSlider";
import { Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        email: "",
        password: ""
    });
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        form.append("name", formData.name);
        form.append("businessName", formData.businessName);
        form.append("email", formData.email);
        form.append("phone", phone);
        form.append("password", formData.password);

        try {
            const res = await signUp(form);
            if (res.success) {
                toast.success("Account created! Redirecting...");
                router.push("/dashboard");
            } else {
                toast.error(res.error || "Signup failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">

            {/* Back Button - Alone on top */}
            <div className="w-full max-w-sm flex justify-start mb-4">
                <Link href="/" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <ChevronLeft size={32} />
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm flex flex-col items-center"
            >
                {/* Banner Slider Container */}
                <div className="w-full mb-4">
                    <BannerSlider />
                </div>

                {/* Header */}
                <h1 className="text-3xl font-black text-white text-center mb-1">
                    Join Marqmike
                </h1>
                <p className="text-white/80 text-center mb-6 font-bold text-xs">
                    Start shipping around the world today
                </p>

                <form onSubmit={handleSignup} className="w-full space-y-4">

                    {/* Full Name */}
                    <div className="space-y-0">
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-16 bg-[#003d91]/60 rounded-2xl border border-white/5 px-6 text-white placeholder:text-white/40 font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all"
                        />
                    </div>

                    {/* Business Name */}
                    <div className="space-y-0">
                        <input
                            type="text"
                            placeholder="Logistics Express"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full h-16 bg-[#003d91]/60 rounded-2xl border border-white/5 px-6 text-white placeholder:text-white/40 font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-0">
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-16 bg-[#003d91]/60 rounded-2xl border border-white/5 px-6 text-white placeholder:text-white/40 font-bold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all"
                        />
                    </div>

                    {/* Phone Number - Single Container */}
                    <div className="space-y-0">
                        <PhoneInput
                            value={phone}
                            onChange={setPhone}
                            disabled={loading}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-0">
                        <div className="relative bg-[#003d91]/60 rounded-2xl border border-white/5 focus-within:ring-2 focus-within:ring-brand-pink/50 transition-all">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full h-16 bg-transparent border-none text-white text-lg font-bold px-6 focus:outline-none placeholder:text-white/40"
                                placeholder="Create Password"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-[#ff1493] hover:bg-[#d10f7a] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#ff1493]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? "Creating..." : "Create Account"}
                        {!loading && <ArrowRight size={22} strokeWidth={3} />}
                    </button>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <span className="text-white/40 text-sm font-bold mr-2">Already have an account?</span>
                        <Link href="/login" className="text-[#ff1493] font-bold text-sm hover:underline">
                            Sign in
                        </Link>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
