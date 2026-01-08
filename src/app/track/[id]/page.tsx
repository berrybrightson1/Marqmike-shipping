import { getShipment } from "@/app/actions/shipment";
import Timeline from "@/components/ui/Timeline";
import { ArrowLeft, Box, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function PublicTrackingPage({ params }: { params: { id: string } }) {
    const shipment = await getShipment(params.id);

    return (
        <div className="min-h-screen bg-brand-blue p-6 flex flex-col items-center">
            {/* Nav */}
            <div className="w-full max-w-md flex justify-between items-center mb-8">
                <Link href="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-white font-bold text-lg">Tracking Result</h1>
                <div className="w-10" />
            </div>

            {/* Content */}
            <div className="w-full max-w-md">
                {!shipment ? (
                    <div className="bg-white rounded-3xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Shipment Not Found</h2>
                        <p className="text-slate-500 text-sm">
                            We couldn't find any shipment with ID <span className="font-mono font-bold text-slate-700">{params.id}</span>.
                            Please check the ID and try again.
                        </p>
                        <Link href="/" className="inline-block mt-4 text-brand-blue font-bold text-sm hover:underline">
                            Try Again
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
                        {/* Header Decor */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-pink" />

                        <div className="text-center mb-8 pt-4">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Current Status</p>
                            <h2 className="text-2xl font-bold text-brand-blue mb-1">{shipment.status}</h2>
                            <p className="text-xs text-slate-400 font-mono tracking-wide">{shipment.trackingId}</p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">From</p>
                                <p className="text-sm font-bold text-slate-700">{shipment.origin}</p>
                            </div>
                            <div className="text-slate-300">→</div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">To</p>
                                <p className="text-sm font-bold text-slate-700">{shipment.destination}</p>
                            </div>
                        </div>

                        <div className="pl-2">
                            <Timeline events={shipment.events as any[]} />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400">Marqmike Logistics • 24/7 Support</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
