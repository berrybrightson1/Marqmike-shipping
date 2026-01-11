"use client";

import { formatDistanceToNow, isWithinInterval, subDays, parseISO, startOfDay, endOfDay } from "date-fns";
import { Shield, Activity, Lock, User, Search, Filter, AlertCircle, Clock, Calendar, Check, X } from "lucide-react";
import { useState, useMemo } from "react";

interface AuditLog {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    actorId: string;
    actorName: string | null;
    metadata: any;
    timestamp: Date;
}

export default function AuditLogClient({ logs }: { logs: any[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showDateRange, setShowDateRange] = useState(false);

    // Filter States
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<"ALL" | "24H" | "7D" | "30D">("ALL");

    const uniqueActions = useMemo(() => {
        // Extract unique main actions (e.g. "Create Order" -> "Create")
        // But simpler to just list known types or exact strings
        const actions = new Set(logs.map(l => l.action));
        return Array.from(actions);
    }, [logs]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch =
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.actorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesAction = selectedActions.length === 0 || selectedActions.includes(log.action);

            const logDate = new Date(log.timestamp);
            let matchesDate = true;
            const now = new Date();

            if (dateRange === "24H") {
                matchesDate = isWithinInterval(logDate, { start: subDays(now, 1), end: now });
            } else if (dateRange === "7D") {
                matchesDate = isWithinInterval(logDate, { start: subDays(now, 7), end: now });
            } else if (dateRange === "30D") {
                matchesDate = isWithinInterval(logDate, { start: subDays(now, 30), end: now });
            }

            return matchesSearch && matchesAction && matchesDate;
        });
    }, [logs, searchTerm, selectedActions, dateRange]);

    const toggleAction = (action: string) => {
        setSelectedActions(prev =>
            prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
        );
    };

    return (
        <div className="p-6 md:p-10 space-y-8 min-h-screen bg-[#F2F6FC]">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Security Audit Log</h1>
                    <p className="text-slate-500 mt-2 text-base font-medium">
                        Monitor system security, user activity, and sensitive data changes.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 shadow-sm flex items-center gap-2">
                        <Lock size={14} className="text-slate-400" />
                        Immutable Record
                    </div>
                </div>
            </header>

            {/* Main Content Card */}
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-slate-50/50">
                    <div className="relative w-full xl:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 w-full xl:w-auto relative">
                        {/* Filter Button & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowFilters(!showFilters); setShowDateRange(false); }}
                                className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-bold text-sm transition-all ${showFilters ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} />
                                Filter
                                {selectedActions.length > 0 && <span className="bg-brand-pink text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{selectedActions.length}</span>}
                            </button>

                            {showFilters && (
                                <div className="absolute top-14 right-0 z-50 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 origin-top-right">
                                    <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider">By Action Type</div>
                                    <div className="max-h-60 overflow-y-auto space-y-1">
                                        {uniqueActions.map(action => (
                                            <button
                                                key={action}
                                                onClick={() => toggleAction(action)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${selectedActions.includes(action) ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {action}
                                                {selectedActions.includes(action) && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedActions.length > 0 && (
                                        <div className="p-2 border-t border-slate-50 mt-2">
                                            <button onClick={() => setSelectedActions([])} className="w-full text-xs text-red-500 font-bold py-2 hover:bg-red-50 rounded-lg">
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date Range Button & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowDateRange(!showDateRange); setShowFilters(false); }}
                                className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-bold text-sm transition-all ${showDateRange ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Calendar size={16} />
                                {dateRange === "ALL" ? "Date Range" : dateRange}
                            </button>

                            {showDateRange && (
                                <div className="absolute top-14 right-0 z-50 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 origin-top-right">
                                    <div className="p-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Select Range</div>
                                    <button onClick={() => { setDateRange("ALL"); setShowDateRange(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${dateRange === "ALL" ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}>All Time</button>
                                    <button onClick={() => { setDateRange("24H"); setShowDateRange(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${dateRange === "24H" ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}>Last 24 Hours</button>
                                    <button onClick={() => { setDateRange("7D"); setShowDateRange(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${dateRange === "7D" ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}>Last 7 Days</button>
                                    <button onClick={() => { setDateRange("30D"); setShowDateRange(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold ${dateRange === "30D" ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}>Last 30 Days</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest w-64">Actor</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest w-48">Action</th>
                                <th className="text-left py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest">Details</th>
                                <th className="text-right py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-widest w-48">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                        <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No audit records found matching your filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-colors">
                                                    {log.actorName ? log.actorName.charAt(0).toUpperCase() : <User size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm">
                                                        {log.actorName || "System"}
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
                                                        System User
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${log.action.includes("Delete") || log.action.includes("Block") ? "bg-red-50 text-red-600 border-red-100" :
                                                log.action.includes("Create") || log.action.includes("Approve") ? "bg-green-50 text-green-600 border-green-100" :
                                                    log.action.includes("Update") ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        log.action.includes("Login") ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                            "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                {log.action.includes("Delete") ? <AlertCircle size={12} /> : <Activity size={12} />}
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                                                {log.details}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-slate-700 text-sm">
                                                    {new Date(log.timestamp).toLocaleDateString(undefined, {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual Only) */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Showing {filteredLogs.length} of {logs.length} records
                    </p>
                </div>
            </div>
        </div>
    );
}
