"use client";

import { useEffect, useState } from "react";
import { getShipment } from "@/app/actions/shipment"; // Reuse existing action
import { Box, MapPin, Printer } from "lucide-react";

export default function InvoicePage({ params }: { params: { id: string } }) {
    const [shipment, setShipment] = useState<any>(null);

    useEffect(() => {
        getShipment(params.id).then(setShipment);
    }, [params.id]);

    if (!shipment) return <div className="p-10 text-center">Loading Invoice...</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-12 flex justify-center">
            {/* Invoice Container - A4ish */}
            <div className="bg-white w-full max-w-3xl shadow-xl p-10 md:p-16 relative print:shadow-none print:w-full print:max-w-none print:p-0">
                {/* Print Button */}
                <button
                    onClick={handlePrint}
                    className="absolute top-6 right-6 flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 print:hidden"
                >
                    <Printer size={16} /> Print / PDF
                </button>

                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center text-white text-2xl font-bold italic">M</div>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue tracking-tight">Marqmike</h1>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Global Shipping</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-mono font-bold text-slate-200 uppercase">Invoice</h2>
                        <p className="font-mono font-bold text-slate-700 mt-2">#{shipment.trackingId}</p>
                        <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">From (Shipper)</h3>
                        <div className="font-bold text-slate-800 text-lg">{shipment.shipperName}</div>
                        <div className="text-slate-500 text-sm mt-1">{shipment.origin}</div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">To (Recipient)</h3>
                        <div className="font-bold text-slate-800 text-lg">{shipment.recipientName}</div>
                        <div className="text-slate-500 text-sm mt-1">{shipment.destination}</div>
                    </div>
                </div>

                {/* Item Details */}
                <div className="mb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="py-3 text-xs font-bold text-slate-400 uppercase">Description</th>
                                <th className="py-3 text-xs font-bold text-slate-400 uppercase text-right">Weight</th>
                                <th className="py-3 text-xs font-bold text-slate-400 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr>
                                <td className="py-4 font-bold text-slate-700">
                                    Shipping Charges - Standard Air
                                    <div className="text-xs text-slate-400 font-normal mt-1">{shipment.origin} to {shipment.destination}</div>
                                </td>
                                <td className="py-4 text-right font-mono text-slate-600">2.5 kg</td>
                                <td className="py-4 text-right font-mono font-bold text-slate-800">$45.00</td>
                            </tr>
                            <tr>
                                <td className="py-4 font-bold text-slate-700">Service Fee</td>
                                <td className="py-4 text-right font-mono text-slate-600">-</td>
                                <td className="py-4 text-right font-mono font-bold text-slate-800">$5.00</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-800">
                                <td className="pt-4 text-sm font-bold text-slate-600">Total</td>
                                <td></td>
                                <td className="pt-4 text-right text-xl font-bold font-mono text-brand-blue">$50.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 pt-8 text-center">
                    <p className="text-sm font-bold text-slate-700 mb-2">Thank you for shipping with Marqmike!</p>
                    <p className="text-xs text-slate-400">Questions? Contact support@marqmike.com or +233 55 555 5555</p>
                    <div className="mt-8 flex justify-center gap-4 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                        <span>Marqmike Shipping</span>
                        <span>•</span>
                        <span>Accra, Ghana</span>
                        <span>•</span>
                        <span>Guangzhou, China</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
