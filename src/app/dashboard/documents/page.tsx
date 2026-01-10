"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Download, Upload, Plus, X } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import { useState } from "react";
import { toast } from "sonner";

export default function DocumentsPage() {
    const [activeTab, setActiveTab] = useState<'invoices' | 'uploads'>('invoices');
    const [uploads, setUploads] = useState<any[]>([
        { id: 1, name: "National ID Card", date: "Jan 10, 2026", size: "2.4 MB" },
        { id: 2, name: "Business Registration", date: "Jan 05, 2026", size: "1.1 MB" }
    ]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setTimeout(() => {
                setUploads([{
                    id: Date.now(),
                    name: file.name,
                    date: new Date().toLocaleDateString(),
                    size: (file.size / 1024 / 1024).toFixed(1) + " MB"
                }, ...uploads]);
                setIsUploading(false);
                toast.success("Document uploaded successfully");
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative">
                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-10 shadow-xl shadow-brand-blue/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Documents</h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-brand-blue/20 rounded-xl mt-4">
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'invoices' ? 'bg-white text-brand-blue shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                            Invoices
                        </button>
                        <button
                            onClick={() => setActiveTab('uploads')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'uploads' ? 'bg-white text-brand-blue shadow-sm' : 'text-white/60 hover:text-white'}`}
                        >
                            My Documents
                        </button>
                    </div>
                </div>

                <div className="px-6 -mt-4 relative z-10 space-y-4">
                    {activeTab === 'invoices' && (
                        <>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
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
                        </>
                    )}

                    {activeTab === 'uploads' && (
                        <>
                            {/* Upload Button */}
                            <label className="block w-full border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-blue hover:bg-blue-50/50 transition-colors cursor-pointer group">
                                <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-2 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    {isUploading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Upload size={20} />}
                                </div>
                                <p className="text-xs font-bold text-slate-600">Tap to upload File</p>
                                <p className="text-[10px] text-slate-400">PDF, JPG up to 5MB</p>
                            </label>

                            {uploads.map((doc) => (
                                <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center text-brand-blue">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-brand-blue truncate max-w-[150px]">{doc.name}</h3>
                                            <p className="text-[10px] text-slate-400">{doc.date} • {doc.size}</p>
                                        </div>
                                    </div>
                                    <button className="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <BottomNav />
            </div>
        </div>
    )
}
