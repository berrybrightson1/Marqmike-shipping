"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export default function AdminCharts({ data }: { data?: any }) {
    // Default fallback if no data provided
    const shipmentData = data?.shipmentData || [];
    const revenueData = data?.revenueData || [];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Shipments Chart */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Shipment Volume</h3>
                    <p className="text-sm text-slate-500">Monthly shipment processing overview</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={shipmentData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fpr9' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="shipments" fill="#0049AD" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Revenue Trends</h3>
                        <p className="text-sm text-slate-500">Gross income analytics</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">$51.3k</p>
                        <p className="text-xs text-green-500 font-bold">+12.5% vs last month</p>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0049AD" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#0049AD" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#0049AD" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
