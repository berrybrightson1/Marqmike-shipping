"use client";

import Link from "next/link";
import { ChevronLeft, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const contacts = [
        { name: "Main Office Support", number: "+233 54 123 4567", type: "Mobile" },
        { name: "Technical Support", number: "+233 24 987 6543", type: "WhatsApp" },
        { name: "Customer Service", number: "+233 20 111 2222", type: "Mobile" }
    ];

    return (
        <div className="min-h-screen bg-[#074eaf] relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans">

            {/* Back Button */}
            <Link href="/login" className="absolute top-8 left-8 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10">
                <ChevronLeft size={32} />
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm flex flex-col items-center"
            >
                {/* Icon Header */}
                <div className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 shadow-xl backdrop-blur-sm">
                    <ShieldCheck size={48} className="text-white" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white text-center mb-4">
                    Reset Password
                </h1>
                <p className="text-white/70 text-center mb-10 font-medium text-sm leading-relaxed max-w-xs">
                    For your security, password resets are handled manually. Please contact our support team directly.
                </p>

                {/* Contact List */}
                <div className="w-full space-y-4">
                    {contacts.map((contact, index) => (
                        <div
                            key={index}
                            className={`w-full backdrop-blur-md rounded-3xl border border-white/10 p-5 flex items-center justify-between shadow-lg transition-all hover:scale-[1.02] ${index === 0 ? "bg-gradient-to-r from-[#00c6ff]/20 to-[#0072ff]/20 hover:from-[#00c6ff]/30 hover:to-[#0072ff]/30" :
                                    index === 1 ? "bg-gradient-to-r from-[#b31217]/20 to-[#e52d27]/20 hover:from-[#b31217]/30 hover:to-[#e52d27]/30" :
                                        "bg-gradient-to-r from-[#11998e]/20 to-[#38ef7d]/20 hover:from-[#11998e]/30 hover:to-[#38ef7d]/30"
                                }`}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm text-white/90 font-medium mb-1">
                                    {contact.name}
                                </span>
                                <span className="text-white font-black text-xl tracking-wide">
                                    {contact.number}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <a href={`tel:${contact.number.replace(/\s/g, '')}`} className="p-3 bg-white/10 rounded-full text-white hover:bg-white hover:text-[#074eaf] transition-colors shadow-sm border border-white/5">
                                    <Phone size={20} />
                                </a>
                                {contact.type === "WhatsApp" && (
                                    <a href={`https://wa.me/${contact.number.replace(/\s/g, '').replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#25D366]/20 rounded-full text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors shadow-sm border border-white/5">
                                        <MessageSquare size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center border-t border-white/10 pt-8 w-full">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
                        Available Mon - Sat • 8am - 6pm
                    </p>
                </div>

            </motion.div>
        </div>
    );
}
