"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Bell, Package, Tag, Info, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
    const notifications = [
        { id: 1, type: "shipment", title: "Shipment Arrived", message: "Your package #MQM-8821 has arrived in Accra.", time: "2 hours ago", read: false, icon: Package },
        { id: 2, type: "promo", title: "50% Off Shipping", message: "Get half-price shipping on your next order over 10kg.", time: "1 day ago", read: true, icon: Tag },
        { id: 3, type: "system", title: "System Maintenance", message: "Scheduled maintenance on Sunday 2 AM - 4 AM.", time: "2 days ago", read: true, icon: Info },
        { id: 4, type: "success", title: "Payment Successful", message: "Wallet top-up of $500.00 confirmed.", time: "3 days ago", read: true, icon: CheckCircle2 },
    ];

    return (
        <div className="min-h-screen bg-[#F2F6FC]">
            <DashboardHeader />

            <div className="px-6 -mt-16 relative z-10 pb-24 max-w-md mx-auto">
                <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Bell size={20} className="text-brand-blue" />
                            Notifications
                        </h3>
                        <button className="text-xs font-bold text-brand-blue hover:text-blue-700">Mark all read</button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`p-6 flex gap-4 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                    ${notif.type === 'shipment' ? 'bg-blue-100 text-brand-blue' :
                                        notif.type === 'promo' ? 'bg-purple-100 text-purple-600' :
                                            notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <notif.icon size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm ${!notif.read ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                                </div>
                                {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-brand-pink mt-2 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
