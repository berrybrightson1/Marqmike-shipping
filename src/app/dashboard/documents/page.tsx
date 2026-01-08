import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative">
                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Documents</h1>
                    </div>
                </div>

                <div className="px-6 -mt-4 relative z-10 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-brand-blue">Invoice #00{i}</h3>
                                    <p className="text-[10px] text-slate-400">Oct 24, 2025 • PDF</p>
                                </div>
                            </div>
                            <button className="text-brand-pink hover:bg-brand-pink/5 p-2 rounded-full transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <BottomNav />
            </div>
        </div>
    )
}
