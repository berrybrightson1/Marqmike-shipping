"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, AlertCircle, CheckCircle, Clock, MoreVertical, ChevronDown } from "lucide-react";

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState([
        { id: "TKT-1029", user: "Howard Tamesis", subject: "Shipment Delayed", status: "Open", priority: "High", date: "2 mins ago" },
        { id: "TKT-1030", user: "Sarah Jones", subject: "Payment Issue", status: "In Progress", priority: "Medium", date: "1 hour ago" },
        { id: "TKT-1025", user: "Mike Smith", subject: "Address Change Request", status: "Resolved", priority: "Low", date: "1 day ago" },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-700 border-red-200';
            case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-orange-600 bg-orange-50';
            case 'Low': return 'text-slate-600 bg-slate-100';
            default: return 'text-slate-600';
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 bg-[#F2F6FC] min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Support Tickets</h1>
                    <p className="text-slate-500 mt-1">Manage customer inquiries and issues.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border text-slate-600 px-4 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </header>

            {/* Kanban / List Board */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-brand-blue/5 border border-white/50 min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 ring-brand-blue/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4 pl-0">Ticket ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Subject</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Last Update</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="p-4 pl-0">
                                        <span className="font-mono font-bold text-slate-700">#{ticket.id}</span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">{ticket.user}</td>
                                    <td className="p-4 text-sm font-medium text-slate-600">{ticket.subject}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-xs font-bold text-slate-400">{ticket.date}</td>
                                    <td className="p-4 text-right">
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
