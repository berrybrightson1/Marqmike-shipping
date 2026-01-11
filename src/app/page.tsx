"use client";

import { ArrowRight, Box, Globe, Shield, Truck, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#074eaf] relative overflow-x-hidden font-sans text-white selection:bg-brand-pink selection:text-white">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-pink/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#074eaf]/80 backdrop-blur-md border-b border-white/5 py-4" : "py-6 bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              {/* Simple Icon Logo Representation */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-blue fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight hidden md:block">Marqmike</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/track">Track</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/contact">Support</NavLink>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Log In</Link>
            <Link href="/signup">
              <button className="bg-white text-brand-blue px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-pink hover:text-white transition-all shadow-lg hover:shadow-brand-pink/25 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[60] bg-[#074eaf] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold">Marqmike</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-bold">
              <Link href="/track" onClick={() => setMobileMenuOpen(false)}>Track Shipment</Link>
              <Link href="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Support</Link>
              <hr className="border-white/10 my-4" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-brand-pink">Create Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative pt-32 md:pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-green-300">SYSTEM OPERATIONAL 24/7</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
        >
          Global Shipping <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-400">Reimagined.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
        >
          The fastest, most reliable way to track packages and manage global logistics.
          Join thousands of businesses scaling with Marqmike.
        </motion.p>

        {/* Tracking Input Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xl mx-auto mb-20"
        >
          <TrackingInput />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
          <FeatureCard
            icon={Globe}
            title="Global Network"
            desc="Seamless shipping to over 200 countries worldwide."
            delay={0.5}
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Insured"
            desc="Every package is protected with premium insurance."
            delay={0.6}
          />
          <FeatureCard
            icon={Truck}
            title="Real-time Tracking"
            desc="Live updates at every checkpoint of the journey."
            delay={0.7}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-[#074eaf]/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-bold">© 2026 Marqmike Shipping. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/40 hover:text-white text-sm font-bold transition-colors">Terms</Link>
            <Link href="/privacy" className="text-white/40 hover:text-white text-sm font-bold transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-bold text-white/70 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-pink transition-all group-hover:w-full" />
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
    >
      <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-blue/20">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function TrackingInput() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(/^(MQM|TRK)-\d{4,}$/i.test(input.trim()));
  }, [input]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      router.push(`/track/${input.trim().toUpperCase()}`);
    }
  };

  return (
    <form onSubmit={handleTrack} className="relative group">
      <div className={`
                relative flex items-center bg-white/10 backdrop-blur-xl border 
                rounded-3xl p-2 transition-all duration-300
                ${isValid ? 'border-brand-pink/50 shadow-[0_0_40px_-10px_rgba(255,20,147,0.3)]' : 'border-white/10 shadow-2xl'}
            `}>
        <div className="pl-6 text-white/40">
          <Box size={24} />
        </div>
        <input
          type="text"
          placeholder="Enter Tracking ID (e.g. MQM-1234)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent border-none text-white placeholder:text-white/30 text-lg font-bold px-4 py-4 focus:ring-0 focus:outline-none tracking-wide"
        />
        <button
          type="submit"
          disabled={!isValid}
          className={`
                        h-14 px-8 rounded-2xl font-bold flex items-center gap-2 transition-all
                        ${isValid
              ? 'bg-brand-pink text-white hover:bg-pink-600 shadow-lg shadow-brand-pink/30 hover:shadow-brand-pink/50 translate-x-0'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }
                    `}
        >
          Track <ArrowRight size={18} />
        </button>
      </div>
      {/* Helper Text */}
      <div className="absolute -bottom-8 left-0 w-full text-center">
        <AnimatePresence>
          {isValid && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[10px] font-bold text-brand-pink uppercase tracking-widest"
            >
              Ready to Track
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
