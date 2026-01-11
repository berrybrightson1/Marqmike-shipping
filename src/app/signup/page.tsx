"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import PhoneInput from "@/components/auth/PhoneInput";
import { Lock, Eye, EyeOff, ArrowRight, User, Mail, Briefcase } from "lucide-react";
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
        <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6">

            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#ff1493]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8 text-white">
                    <h1 className="text-3xl font-black mb-2">Create Account</h1>
                    <p className="opacity-60 font-medium">Join Marqmike Shipping today</p>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-5">

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/80 uppercase tracking-widest ml-4">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 text-white placeholder:text-white/20 font-bold focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Business Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/80 uppercase tracking-widest ml-4">Business Name (Optional)</label>
                            <div className="relative">
                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="text"
                                    placeholder="My Shop Ltd"
                                    value={formData.businessName}
                                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 text-white placeholder:text-white/20 font-bold focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/80 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-6 text-white placeholder:text-white/20 font-bold focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/80 uppercase tracking-widest ml-4">Phone Number</label>
                            <PhoneInput
                                value={phone}
                                onChange={setPhone}
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/80 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[24px] pl-14 pr-14 text-white placeholder:text-white/20 font-bold focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-20 bg-[#ff1493] hover:bg-[#d10f7a] text-white rounded-[28px] font-black text-lg shadow-xl shadow-[#ff1493]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-6"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                            {!loading && <ArrowRight size={24} strokeWidth={3} />}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center pb-8">
                    <p className="text-white/40 font-bold mb-4">Already have an account?</p>
                    <Link href="/login" className="text-white font-bold hover:underline decoration-[#ff1493]">
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
