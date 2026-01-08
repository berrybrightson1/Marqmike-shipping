import { CheckCircle2, Circle, Truck } from "lucide-react";

interface TimelineEvent {
    status: string;
    location: string;
    timestamp: string;
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
    // Demo defaults if empty
    const displayEvents = events.length > 0 ? events : [
        { status: "Shipment Created", location: "System", timestamp: "Just now" }
    ];

    return (
        <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {displayEvents.map((event, index) => (
                <div key={index} className="relative flex items-start gap-4 z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 ${index === 0 ? "border-brand-pink text-brand-pink" : "border-slate-300 text-slate-300"} shadow-sm`}>
                        {index === 0 ? <Truck size={12} /> : <CheckCircle2 size={14} />}
                    </div>
                    <div>
                        <p className={`text-xs font-bold ${index === 0 ? "text-brand-blue" : "text-slate-500"}`}>{event.status}</p>
                        <p className="text-[10px] text-slate-400">{event.location} • {event.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
