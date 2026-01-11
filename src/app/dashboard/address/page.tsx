"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, MapPin, Phone, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";
import { toast } from "sonner";

export default function AddressPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (!user) return <div className="min-h-screen bg-[#F2F6FC] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" /></div>;

    const shippingMark = `MQM-${user.phone?.slice(-4) || '1234'}`;
    const chinaName = `${user.name} (${shippingMark})`;

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen relative flex flex-col">
                {/* Header */}
                <div className="bg-brand-blue pt-12 pb-8 px-6 rounded-b-[40px] relative z-20 shrink-0 shadow-xl shadow-brand-blue/20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Warehouse Addresses</h1>
                    </div>
                    <p className="text-white/60 text-xs">Use these details for your online purchases.</p>
                </div>

                {/* Content */}
                <div className="px-6 mt-6 relative z-10 flex-1 space-y-6">

                    {/* China Warehouse Card */}
                    <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Building2 size={100} className="text-brand-blue" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
                                <span className="text-xs">CN</span>
                            </span>
                            China Warehouse
                        </h2>

                        <div className="space-y-5 relative bg-white/50 backdrop-blur-sm rounded-xl">
                            {/* Name Field */}
                            <AddressField
                                label="Contact Name (Receiver)"
                                value={chinaName}
                                onCopy={() => handleCopy(chinaName, "Contact Name")}
                            />

                            {/* Address Field */}
                            <AddressField
                                label="Address"
                                value="Guangzhou Baiyun District, Shijing Street, No. 168 (Marqmike Warehouse)"
                                onCopy={() => handleCopy("Guangzhou Baiyun District, Shijing Street, No. 168 (Marqmike Warehouse)", "Address")}
                            />

                            {/* Phone Field */}
                            <AddressField
                                label="Phone Number"
                                value="+86 130 0000 0000"
                                onCopy={() => handleCopy("+86 130 0000 0000", "Phone Number")}
                            />
                        </div>

                        {/* Shipping Mark Alert */}
                        <div className="mt-6 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                            <div className="shrink-0 text-amber-500 mt-1">
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-700 mb-1">Important</h4>
                                <p className="text-[11px] text-amber-600/80 leading-relaxed">
                                    Your <strong>Shipping Mark ({shippingMark})</strong> is crucial. Always include it in the name or address so we can identify your package.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ghana Office Card */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <span className="text-xs">GH</span>
                            </span>
                            Ghana Office (Pickup)
                        </h2>
                        <div className="space-y-4">
                            <AddressField
                                label="Physical Address"
                                value="Gye Nyame Street, Taifa, Accra, Ghana"
                                onCopy={() => handleCopy("Gye Nyame Street, Taifa, Accra, Ghana", "Ghana Address")}
                            />
                            <AddressField
                                label="Office Phone"
                                value="0302448360"
                                onCopy={() => handleCopy("0302448360", "Office Phone")}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function AddressField({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
    return (
        <div className="group/field">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{label}</label>
            <div
                onClick={onCopy}
                className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 flex justify-between items-center cursor-pointer active:scale-[0.99]"
            >
                <span className="text-sm font-bold text-slate-700 leading-tight pr-4">{value}</span>
                <Copy size={14} className="text-slate-300 group-hover/field:text-brand-blue transition-colors shrink-0" />
            </div>
        </div>
    );
}
