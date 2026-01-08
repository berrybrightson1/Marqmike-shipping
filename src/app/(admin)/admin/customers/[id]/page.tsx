"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, Shield, Ban } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock Data Fetcher (Replace with Server Action later)
const getUser = async (id: string) => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 500));
    return {
        id,
        name: "Howard Tamesis",
        email: "howard@marqmike.com",
        phone: "+233 55 555 5555",
        role: "user",
        status: "Active",
        joinDate: "Jan 12, 2024",
        spent: 1250.00,
        orders: [
            { id: "MQM-8821", date: "May 20, 2024", amount: 150, status: "Delivered" },
            { id: "MQM-9932", date: "Jun 10, 2024", amount: 320, status: "In Transit" },
        ]
    };
};

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUser(params.id).then(u => {
            setUser(u);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) return <div className="p-10 text-center">Loading User...</div>;
    if (!user) notFound();

    return (
        <div className="p-6 md:p-10 space-y-8 bg-[#F2F6FC] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/customers" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:text-brand-blue transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Profile</h1>
                    <p className="text-slate-500 text-sm">Manage user details and permissions.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* User Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-brand-blue/5 border border-white/50 h-fit">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-brand-blue/5 border-4 border-white shadow-lg mb-4 overflow-hidden">
                            <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-blue-100 text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase">{user.role}</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{user.status}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                <p className="text-sm font-bold text-slate-700">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                                <p className="text-sm font-bold text-slate-700">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Joined</p>
                                <p className="text-sm font-bold text-slate-700">{user.joinDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-3">
                        <button className="py-3 bg-brand-blue/10 text-brand-blue rounded-xl font-bold text-sm hover:bg-brand-blue/20 transition-colors flex items-center justify-center gap-2">
                            <Shield size={16} /> Make Admin
                        </button>
                        <button className="py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                            <Ban size={16} /> Suspend User
                        </button>
                    </div>
                </div>

                {/* Activity & Orders */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Spent</p>
                            <h3 className="text-2xl font-bold text-slate-800">${user.spent.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Orders</p>
                            <h3 className="text-2xl font-bold text-slate-800">{user.orders.length}</h3>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 border border-white/60">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">Order History</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {user.orders.map((order: any) => (
                                <div key={order.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{order.id}</p>
                                            <p className="text-xs text-slate-400">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">${order.amount}</p>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>{order.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
