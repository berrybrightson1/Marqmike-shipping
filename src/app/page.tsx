"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [trackingInput, setTrackingInput] = useState("");

  const isValidTracking = (id: string) => {
    return /^(MQM|TRK)-\d{4,}$/i.test(id.trim());
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidTracking(trackingInput)) {
      router.push(`/track/${trackingInput.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">
      {/* Brand Logo */}
      <div className="absolute top-12 left-0 w-full flex justify-center z-20">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          src="/logos/marqmike-white-logo.svg"
          alt="Marqmike Logo"
          className="h-44 md:h-64 w-auto hover:scale-105 transition-transform cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-md text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight pt-10">
          Track your <br />
          Packages <br />
          <span className="text-[#ff1493]">Instantly</span>
        </h2>

        <p className="text-white/80 mb-12 text-sm md:text-base leading-relaxed max-w-[280px] mx-auto font-bold tracking-tight">
          Real-time global logistics tracking at your fingertips.
        </p>

        {/* glassmorphic Tracking Input */}
        <form onSubmit={handleTrack} className="mb-12 group">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="MQM-1234 or TRK-5678"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className={`w-full h-20 rounded-[28px] pl-8 pr-20 bg-white/5 backdrop-blur-2xl border text-white placeholder:text-white/20 focus:outline-none transition-all font-mono text-lg shadow-2xl ${isValidTracking(trackingInput)
                ? "border-green-500/50 focus:ring-4 focus:ring-green-500/20 shadow-green-500/20"
                : "border-white/10 focus:ring-4 focus:ring-white/5"
                }`}
            />
            <button
              type="submit"
              title="Track Shipment"
              disabled={!isValidTracking(trackingInput)}
              className={`absolute right-3 top-3 h-14 w-14 rounded-[20px] flex items-center justify-center transition-all shadow-xl ${isValidTracking(trackingInput)
                ? "bg-green-500 text-white hover:scale-105 active:scale-95 shadow-green-500/40"
                : "bg-white/10 text-white/20 cursor-not-allowed"
                }`}
            >
              <ArrowRight size={24} strokeWidth={2.5} />
            </button>
          </div>
          {isValidTracking(trackingInput) && (
            <p className="mt-3 text-[10px] font-black text-green-400 uppercase tracking-widest animate-fade-in text-center">
              Ready to Track
            </p>
          )}
        </form>

        {/* Customer Access */}
        <div className="flex flex-col items-center gap-6">
          <Link href="/auth/login" className="w-full">
            <button className="w-full bg-[#ff1493] hover:bg-[#ff1493]/90 text-white font-black py-6 rounded-[24px] shadow-2xl shadow-[#ff1493]/20 transition-all text-sm tracking-wide uppercase">
              Sign In to Dashboard
            </button>
          </Link>

          <p className="mt-8 text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">
            Terms of Service &bull; Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
