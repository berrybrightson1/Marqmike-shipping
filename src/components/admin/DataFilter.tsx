"use client";

import { useState } from "react";
import { Filter, Calendar, ChevronDown, Check } from "lucide-react";
import { format } from "date-fns"; // Standard date lib, assuming installed or I'll implementation simple

export default function DataFilter({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
    const [statusOpen, setStatusOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

    // Simple Date Range Mock
    const [dateRange, setDateRange] = useState("Last 30 Days");

    const statuses = ["Pending", "Processing", "In Transit", "Delivered", "Cancelled"];

    const toggleStatus = (status: string) => {
        const newStatus = selectedStatus.includes(status)
            ? selectedStatus.filter(s => s !== status)
            : [...selectedStatus, status];
        setSelectedStatus(newStatus);
        onFilterChange({ status: newStatus });
    };

    return (
        <div className="flex gap-3 items-center">
            {/* Date Range Picker Mock */}
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Calendar size={16} className="text-slate-400" />
                <span>{dateRange}</span>
                <ChevronDown size={14} className="text-slate-300" />
            </button>

            {/* Status Filter */}
            <div className="relative">
                <button
                    onClick={() => setStatusOpen(!statusOpen)}
                    className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${selectedStatus.length > 0 ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                    <Filter size={16} className={selectedStatus.length > 0 ? "text-brand-blue" : "text-slate-400"} />
                    <span>Status</span>
                    {selectedStatus.length > 0 && (
                        <span className="bg-brand-blue text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                            {selectedStatus.length}
                        </span>
                    )}
                    <ChevronDown size={14} className={selectedStatus.length > 0 ? "text-brand-blue" : "text-slate-300"} />
                </button>

                {statusOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                        <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-20 animate-in fade-in zoom-in-95">
                            {statuses.map(status => (
                                <div
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                                >
                                    <span className={`text-sm font-bold ${selectedStatus.includes(status) ? 'text-brand-blue' : 'text-slate-600'}`}>{status}</span>
                                    {selectedStatus.includes(status) && <Check size={14} className="text-brand-blue" />}
                                </div>
                            ))}
                            <div className="border-t border-slate-50 mt-2 pt-2">
                                <button
                                    onClick={() => { setSelectedStatus([]); onFilterChange({ status: [] }); setStatusOpen(false); }}
                                    className="w-full text-xs text-slate-400 hover:text-slate-600 font-bold py-1"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
