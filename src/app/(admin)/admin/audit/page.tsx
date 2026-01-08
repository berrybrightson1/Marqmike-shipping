import { getAuditLogs } from "@/app/actions/audit";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { Shield, Activity, Lock, User } from "lucide-react";

export default async function AuditLogPage() {
    const { data: logs } = await getAuditLogs();

    return (
        <div className="p-6 md:p-10 space-y-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Security Audit Log</h1>
                    <p className="text-slate-500 mt-1">Track system changes and sensitive actions.</p>
                </div>
                <div className="bg-white/50 px-4 py-2 rounded-lg text-xs font-mono text-slate-500 border border-white/60">
                    Immutable Record
                </div>
            </header>

            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 p-6 min-h-[600px]">
                <div className="space-y-4">
                    {logs?.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <Shield size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No audit records found.</p>
                        </div>
                    ) : (
                        logs?.map((log) => (
                            <div key={log.id} className="flex gap-4 p-4 hover:bg-white/50 rounded-2xl transition-colors border border-transparent hover:border-white/60">
                                {/* Icon based on action */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${log.action.includes("Delete") ? "bg-red-100 text-red-600" :
                                        log.action.includes("Update") ? "bg-blue-100 text-blue-600" :
                                            "bg-slate-100 text-slate-600"
                                    }`}>
                                    {log.action.includes("Delete") ? <Lock size={20} /> : <Activity size={20} />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800">{log.action}</h4>
                                        <span className="text-xs font-mono text-slate-400">
                                            {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                        <User size={12} />
                                        <span>Performed by <span className="font-bold text-slate-600">{log.adminName}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
