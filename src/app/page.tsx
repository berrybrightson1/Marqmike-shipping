"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Box, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [trackingInput, setTrackingInput] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(`/track/${trackingInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-blue relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />
      </div>

      {/* Brand */}
      <div className="absolute top-8 left-0 w-full flex justify-center">
        <h1 className="text-3xl font-bold italic text-white tracking-tight">
          Marqmike<span className="text-brand-pink">.</span>
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center">
        <Box size={64} className="text-white mx-auto mb-8 opacity-90" strokeWidth={1.5} />

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Track your <br />
          <span className="text-brand-pink">packages</span> instantly.
        </h2>

        <p className="text-white/60 mb-10 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
          Enter your tracking number below to check the status of your delivery in real-time.
        </p>

        {/* Tracking Input */}
        <form onSubmit={handleTrack} className="mb-8 relative">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. TRK-123)"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="w-full h-16 rounded-full pl-6 pr-16 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-mono text-sm"
          />
          <button
            type="submit"
            aria-label="Track Shipment"
            className="absolute right-2 top-2 h-12 w-12 bg-white rounded-full flex items-center justify-center text-brand-blue hover:bg-brand-pink hover:text-white transition-all shadow-lg"
          >
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl hover:bg-[#e0007d] transition-colors shadow-lg shadow-brand-pink/30 text-sm">
              Employee Login
            </button>
          </Link>
          <button className="text-white/40 text-xs font-medium hover:text-white transition-colors">
            Terms of Service • Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
