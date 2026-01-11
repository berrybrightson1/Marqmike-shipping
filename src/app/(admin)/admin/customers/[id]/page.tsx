import { getCustomerDetails, getCustomerShipments, getCustomerAuditLogs } from "@/app/actions/customer";
import { ArrowLeft, Package, Clock, Shield, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [userRes, shipmentsRes, logsRes] = await Promise.all([
        getCustomerDetails(id),
        getCustomerShipments(id),
        getCustomerAuditLogs(id)
    ]);

    const user = userRes.data;
    const shipments = shipmentsRes.data || [];
    const logs = logsRes.data || [];

    if (!user) {
        return <div className="p-10 text-center">User not found</div>;
    }

    return (
        <div className="p-6 md:p-10 space-y-8 min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6">
                <Link href="/admin/customers" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{user.name || "Unknown User"}</h1>
                    <p className="text-slate-500 text-sm">Customer Profile & History</p>
                </div>
            </header>

            {/* Profile Logic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-brand-blue/5"></div>
                        <div className="relative z-10 w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-lg mb-4">
                            <div className="w-full h-full rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink text-3xl font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">{user.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block mb-6 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                            {user.role}
                        </span>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center gap-3 text-sm p-4 bg-slate-50 rounded-2xl">
                                <Mail size={16} className="text-slate-400" />
                                <span className="font-bold text-slate-700 truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm p-4 bg-slate-50 rounded-2xl">
                                <Phone size={16} className="text-slate-400" />
                                <span className="font-bold text-slate-700">{user.phone || "No phone"}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm p-4 bg-slate-50 rounded-2xl">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="font-bold text-slate-700">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & History */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Shipments</div>
                            <div className="text-3xl font-black text-brand-blue">{user._count?.shipments || 0}</div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Requests</div>
                            <div className="text-3xl font-black text-brand-pink">{user._count?.procurementRequests || 0}</div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Activity Score</div>
                            <div className="text-3xl font-black text-green-600">Active</div>
                        </div>
                    </div>

                    {/* Shipments History */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Package size={20} className="text-brand-blue" /> Shipment History
                        </h3>
                        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                            {shipments.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No shipments found.</div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {shipments.map((shipment: any) => (
                                        <div key={shipment.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div>
                                                <div className="font-bold text-slate-700 text-sm">{shipment.trackingId}</div>
                                                <div className="text-xs text-slate-400">{shipment.origin} → {shipment.destination}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-brand-blue'
                                                }`}>
                                                {shipment.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Logs */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-slate-400" /> Activity Log
                        </h3>
                        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                            {logs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No activity recorded.</div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {logs.map((log: any) => (
                                        <div key={log.id} className="p-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-slate-700 text-sm">{log.action}</span>
                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{log.details}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
