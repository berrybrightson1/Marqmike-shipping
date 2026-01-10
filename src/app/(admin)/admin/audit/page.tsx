import { getAuditLogs } from "@/app/actions/audit";
import { formatDistanceToNow } from "date-fns";
import { Shield, Activity, Lock, User, Search, Filter, AlertCircle, Clock } from "lucide-react";

export default async function AuditLogPage() {
    const { data: logs } = await getAuditLogs();

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
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                            <Clock size={16} /> Date Range
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
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
                            {logs?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                        <Shield size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No audit records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                logs?.map((log) => (
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
                                            <span className="text-xs font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual Only) */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                    <button className="text-xs font-bold text-brand-blue hover:text-brand-pink transition-colors">
                        Load More Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
