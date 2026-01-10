"use client";

import { use } from "react";
import { ChevronLeft, MapPin, Package, CheckCircle2, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";

// Mock shipment data
const mockShipments: Record<string, any> = {
    "MQM-8821": {
        status: "In Transit to Ghana",
        origin: "Guangzhou, China",
        destination: "Accra",
        recipientName: "John Doe",
        recipientPhone: "+233 24 123 4567",
        recipientAddress: "East Legon, Accra",
        events: [
            { status: "Received in China", location: "Guangzhou", timestamp: "2024-01-05 10:00", city: "Guangzhou" },
            { status: "Customs Cleared (CN)", location: "Guangzhou Port", timestamp: "2024-01-07 14:30", city: "Guangzhou" },
            { status: "In Transit", location: "Sea Freight", timestamp: "2024-01-08 09:00", city: "At Sea" },
            { status: "Arrived in Ghana", location: "Tema Port", timestamp: "2024-01-14 16:00", city: "Tema" }
        ]
    }
};

export default function TrackingResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, loading } = useSession();
    const shipment = mockShipments[id.toUpperCase()];

    // Privacy: Only show full details if user is admin or shipment owner
    // For now, we'll just check if user is logged in
    const isAuthenticated = !!user;

    if (!shipment) {
        return (
            <div className="min-h-screen bg-[#F2F6FC] flex items-center justify-center p-6">
                <div className="text-center">
                    <Package size={80} className="text-slate-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Shipment Not Found</h1>
                    <p className="text-slate-500 mb-8">Invalid tracking number: {id}</p>
                    <a href="https://wa.me/233551171353" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
                        Contact Support on WhatsApp
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Back Button */}
            <div className="max-w-3xl mx-auto px-6 pt-6">
                <Link href="/track" className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors w-fit">
                    <ChevronLeft size={18} />
                    <span className="font-bold text-sm">New Search</span>
                </Link>
            </div>

            {/* Header */}
            <div className="max-w-3xl mx-auto px-6 mt-6">
                <div className="bg-gradient-to-br from-brand-blue to-[#003d91] rounded-[32px] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-brand-pink/20 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                <Package size={28} />
                            </div>
                            <div>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-wide mb-1">Tracking ID</p>
                                <h1 className="text-2xl font-bold">{id.toUpperCase()}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 w-fit">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm font-bold">{shipment.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="max-w-3xl mx-auto px-6 mt-8">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Shipment Journey</h2>

                    <div className="space-y-6 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-slate-200" />

                        {shipment.events.map((event: any, index: number) => (
                            <div key={index} className="relative flex gap-4">
                                <div className="relative z-10 flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === shipment.events.length - 1 ? 'bg-brand-blue text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                                        {index === shipment.events.length - 1 ? (
                                            <CheckCircle2 size={20} />
                                        ) : (
                                            <Clock size={18} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 pt-1">
                                    <h3 className="font-bold text-slate-800 mb-1">{event.status}</h3>

                                    {/* Guest View: Only City */}
                                    {!isAuthenticated && (
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <MapPin size={14} />
                                            {event.city}
                                        </p>
                                    )}

                                    {/* Authenticated View: Full Details */}
                                    {isAuthenticated && (
                                        <>
                                            <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                                                <MapPin size={14} />
                                                {event.location}
                                            </p>
                                            <p className="text-xs text-slate-400">{event.timestamp}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recipient Details (Only if Authenticated) */}
            {isAuthenticated && (
                <div className="max-w-3xl mx-auto px-6 mt-6">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Delivery Details</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Recipient:</span>
                                <span className="font-bold text-slate-800">{shipment.recipientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Phone:</span>
                                <span className="font-bold text-slate-800">{shipment.recipientPhone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Address:</span>
                                <span className="font-bold text-slate-800 text-right max-w-[200px]">{shipment.recipientAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Guest CTA */}
            {!isAuthenticated && (
                <div className="max-w-3xl mx-auto px-6 mt-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                        <p className="text-sm text-slate-600 mb-4">
                            🔐 Sign in to view full delivery details and recipient information
                        </p>
                        <Link href="/sign-in" className="inline-block bg-brand-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-[#003d91] transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
