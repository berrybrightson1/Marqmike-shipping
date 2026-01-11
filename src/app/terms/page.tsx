"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F2F6FC] p-6">
            <header className="mb-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">Terms & Conditions</h1>
            </header>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6 text-slate-600 leading-relaxed">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. Agreement to Terms</h2>
                    <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Marqmike Shipping (“we,” “us” or “our”), concerning your access to and use of our application.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. User Representations</h2>
                    <p>By using the Application, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. Prohibited Activities</h2>
                    <p>You may not access or use the Application for any purpose other than that for which we make the Application available. The Application may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                </section>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400">Last updated: January 2026</p>
                </div>
            </div>
        </div>
    );
}
