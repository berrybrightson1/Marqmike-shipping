import { getRecentLogs } from "@/app/actions/admin";
import CallLogFeed from "@/components/admin/CallLogFeed";
import LogCallButton from "@/components/admin/LogCallButton"; // New client component wrapper for the button

export default async function CallLogsPage() {
    const { data: logs } = await getRecentLogs();

    return (
        <div className="h-screen bg-[#F2F6FC] relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="pt-8 pb-4 px-6 shrink-0 z-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Call Logs</h1>
                <p className="text-slate-500 text-sm">Recent customer interactions</p>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-hidden relative z-0">
                {/* Glass Blur Overlay at top */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#F2F6FC] to-transparent z-10 pointer-events-none" />

                <CallLogFeed logs={logs || []} />

                {/* Glass Blur Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F2F6FC] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Floating Action Button Wrapper */}
            <LogCallButton />
        </div>
    );
}
