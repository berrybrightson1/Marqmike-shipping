"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F2F6FC] p-6">
            <header className="mb-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
            </header>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. Data Collection</h2>
                    <p>We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application, or otherwise when you contact us.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. Use of Information</h2>
                    <p>We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. Data Sharing</h2>
                    <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                </section>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Last updated: January 2026</p>
                </div>
            </div>
        </div>
    );
}
