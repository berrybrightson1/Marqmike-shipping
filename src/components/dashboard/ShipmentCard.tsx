import Link from "next/link";
import { Box } from "lucide-react";

interface ShipmentCardProps {
    trackingId: string;
    status: string;
    shipper: string;
    recipient: string;
    origin: string;
    destination: string;
}

export default function ShipmentCard({
    trackingId, status, shipper, recipient, origin, destination
}: ShipmentCardProps) {
    return (
        <Link href={`/dashboard/shipment/${trackingId}`} className="block">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-brand-blue/30 transition-all hover:shadow-md">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-brand-blue">
                            <Box size={20} />
                        </div>
                        <div>
                            <h3 className="text-brand-blue font-bold text-lg">{trackingId}</h3>
                            <p className="text-xs text-slate-500 font-medium">Birthday gif</p>
                        </div>
                    </div>
                    <span className="bg-[#8A56E7] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                        {status}
                    </span>
                </div>

                {/* Details Grid */}
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Shipper Name</p>
                        <p className="text-xs font-bold text-brand-blue">{shipper}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Recipient Name</p>
                        <p className="text-xs font-bold text-brand-blue">{recipient}</p>
                    </div>

                    <div className="pt-2 border-t border-dashed border-gray-200">
                        <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-wider">From</p>
                        <p className="text-xs font-bold text-brand-blue">{origin}</p>
                    </div>
                    <div className="text-right pt-2 border-t border-dashed border-gray-200">
                        <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-wider">To</p>
                        <p className="text-xs font-bold text-brand-blue">{destination}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
