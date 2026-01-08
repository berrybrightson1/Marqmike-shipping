"use client";

import { useState } from "react";
import { Plus, Home, Briefcase, MapPin, MoreVertical, Trash2, Edit2, ArrowLeft } from "lucide-react";
import AddAddressModal from "@/components/dashboard/settings/AddAddressModal";
import Link from "next/link";

export default function AddressBookPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([
        { id: 1, label: "Home", address: "123 Osu Badu St, Airport Residential", city: "Accra", phone: "+233 55 123 4567", default: true },
        { id: 2, label: "Office", address: "Marqmike Logistics Hub, Spintex Road", city: "Accra", phone: "+233 24 987 6543", default: false },
    ]);

    return (
        <div className="min-h-screen bg-[#F2F6FC] p-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/settings" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-brand-blue transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Address Book</h1>
                    <p className="text-slate-500 text-sm">Manage your shipping destinations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-auto w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/20 hover:scale-110 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="grid gap-4 max-w-2xl mx-auto">
                {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 relative group overflow-hidden">
                        {addr.default && (
                            <div className="absolute top-0 right-0 bg-brand-pink text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                DEFAULT
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.label === 'Home' ? 'bg-blue-50 text-brand-blue' : 'bg-orange-50 text-orange-500'}`}>
                                {addr.label === 'Home' ? <Home size={20} /> : addr.label === 'Office' ? <Briefcase size={20} /> : <MapPin size={20} />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    {addr.label}
                                </h3>
                                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{addr.address}</p>
                                <p className="text-slate-500 text-sm">{addr.city}</p>
                                <p className="text-slate-400 text-xs font-mono mt-2">{addr.phone}</p>
                            </div>
                        </div>

                        {/* Actions (Hover) */}
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
                            <button className="text-xs font-bold text-slate-400 hover:text-brand-blue flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                                <Edit2 size={14} /> Edit
                            </button>
                            <button className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-md transition-all">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-sm">Add New Address</span>
                </button>
            </div>

            <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
