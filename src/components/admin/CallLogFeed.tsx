"use client";

import { motion } from "framer-motion";
import { Phone, Archive, User, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface CallLog {
    id: string;
    customerName: string;
    phoneNumber: string;
    summary: string;
    outcome: string;
    topic?: string | null;
    createdAt: Date;
}

export default function CallLogFeed({ logs }: { logs: CallLog[] }) {
    return (
        <div className="h-full overflow-y-auto pb-20 space-y-3 px-1 no-scrollbar">
            {logs.map((log) => (
                <CallLogItem key={log.id} log={log} />
            ))}
            {logs.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    No calls logged yet.
                </div>
            )}
        </div>
    );
}

function CallLogItem({ log }: { log: CallLog }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Color logic
    let avatarColor = "bg-slate-200 text-slate-600";
    if (log.outcome === "Resolved") avatarColor = "bg-[#10b981]/20 text-[#10b981]";
    else if (log.outcome === "Pending") avatarColor = "bg-[#f59e0b]/20 text-[#f59e0b]";
    else if (log.outcome === "Urgent") avatarColor = "bg-[#ef4444]/20 text-[#ef4444]";

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            className="relative group"
        >
            {/* Background Actions (Visual only for now since generic swipe is complex without library, 
                but we simulate the layers) 
            */}

            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative z-10 backdrop-blur-md bg-white/40 border-b border-white/20 p-3 flex gap-3 active:bg-white/60 transition-colors cursor-pointer rounded-xl mx-2 mb-2 shadow-sm hover:shadow-md"
            >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center font-bold text-sm shrink-0 border border-black/5`}>
                    {log.customerName.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 truncate pr-2 text-sm">
                            {log.customerName}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap bg-white/50 px-2 py-0.5 rounded-full">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    {log.topic && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 mb-1 mt-1">
                            {log.topic}
                        </span>
                    )}

                    <p className={`text-xs font-medium text-slate-700 mt-0.5 ${!isExpanded && "truncate"}`}>
                        {log.summary}
                    </p>

                    {/* Expanded Details */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 pt-3 border-t border-slate-100 space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${avatarColor}`}>
                                    {log.outcome}
                                </span>

                                {/* Call Type Badge */}
                                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${(log as any).type === "Incoming"
                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                        : "bg-green-50 text-green-600 border-green-100"
                                    }`}>
                                    {(log as any).type === "Incoming" ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                                    {(log as any).type || "Outbound"}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                <Phone size={12} />
                                <a href={`tel:${log.phoneNumber}`} className="hover:text-brand-blue underline decoration-dotted">
                                    {log.phoneNumber}
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
