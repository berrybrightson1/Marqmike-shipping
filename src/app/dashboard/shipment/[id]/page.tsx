import { getShipment } from "@/app/actions/shipment";
import Timeline from "@/components/ui/Timeline";
import { ArrowLeft, MapPin, Box, User, Hash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ShipmentDetailsPage({ params }: { params: { id: string } }) {
    const shipment = await getShipment(params.id);

    if (!shipment) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24 relative overflow-hidden">
            <div className="mx-auto max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative">

                {/* Header with Map Placeholder */}
                <div className="h-64 bg-slate-200 relative">
                    {/* Placeholder Map Image - Using a gradient to simulate map */}
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=51.505,-0.09&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY_HERE')] bg-cover bg-center opacity-50 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F2F6FC]" />

                    {/* Back Button */}
                    <div className="absolute top-12 left-6 z-10">
                        <Link href="/dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-brand-blue hover:scale-105 transition-transform">
                            <ArrowLeft size={20} />
                        </Link>
                    </div>
                </div>

                {/* Content Sheet */}
                <div className="-mt-12 px-6 relative z-10">
                    <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-brand-blue/5 border border-white/50">

                        {/* Status Header */}
                        <div className="flex justify-between items-start mb-6 border-b border-dashed border-slate-100 pb-6">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                <h1 className="text-xl font-bold text-brand-blue">{shipment.status}</h1>
                            </div>
                            <div className="bg-brand-pink/10 px-3 py-1.5 rounded-full">
                                <span className="text-[10px] font-bold text-brand-pink">Estimated: Jun 20</span>
                            </div>
                        </div>

                        {/* Shipment Info Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Hash size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Tracking ID</span>
                                </div>
                                <p className="text-sm font-bold text-brand-blue font-mono">{shipment.trackingId}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Box size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Package</span>
                                </div>
                                <p className="text-sm font-bold text-brand-blue">2.5 kg • Box</p>
                            </div>

                            <div className="space-y-1 col-span-2">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Route</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-brand-blue">
                                    <span>{shipment.origin}</span>
                                    <span className="text-slate-300">→</span>
                                    <span>{shipment.destination}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="text-sm font-bold text-brand-blue mb-4">Tracking History</h3>
                            <Timeline events={shipment.events as any[]} />
                        </div>

                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-white border border-slate-200 text-brand-blue font-bold py-3.5 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                            Report Issue
                        </button>
                        <button className="flex-1 bg-brand-blue text-white font-bold py-3.5 rounded-xl text-xs hover:bg-[#003d91] transition-colors shadow-lg shadow-brand-blue/20">
                            Download Receipt
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
