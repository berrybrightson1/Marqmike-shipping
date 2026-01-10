"use client";

import { MessageSquare, Search, Send, User, LifeBuoy, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getAllTickets, addReply, updateTicketStatus } from "@/app/actions/support";
import { toast } from "sonner";

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Reply Form
    const [replyMessage, setReplyMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredTickets(tickets);
            return;
        }
        const lower = searchQuery.toLowerCase();
        setFilteredTickets(tickets.filter(t =>
            t.subject.toLowerCase().includes(lower) ||
            t.user?.name?.toLowerCase().includes(lower) ||
            t.id.includes(lower)
        ));
    }, [searchQuery, tickets]);

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket, activeTicket?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadTickets = async () => {
        setLoading(true);
        const res = await getAllTickets();
        if (res.success) {
            setTickets(res.data);
            setFilteredTickets(res.data);

            // Update active ticket data if it exists in the new list
            if (activeTicket) {
                const updated = res.data.find((t: any) => t.id === activeTicket.id);
                if (updated) setActiveTicket(updated);
            }
        }
        setLoading(false);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        const originalTicketId = activeTicket.id;

        // Optimistic update
        const tempMsg = {
            id: 'temp-' + Date.now(),
            sender: 'ADMIN',
            message: replyMessage,
            createdAt: new Date()
        };

        setActiveTicket({
            ...activeTicket,
            messages: [...activeTicket.messages, tempMsg]
        });
        setReplyMessage("");

        const res = await addReply(originalTicketId, tempMsg.message, "ADMIN");
        if (res.success) {
            loadTickets(); // Refresh for real ID and status update
        } else {
            toast.error("Failed to send reply");
        }
    };

    const handleStatusChange = async (status: string) => {
        if (!activeTicket) return;
        const res = await updateTicketStatus(activeTicket.id, status);
        if (res.success) {
            toast.success(`Ticket marked as ${status}`);
            loadTickets();
        } else {
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="p-6 md:p-10 h-[calc(100vh-20px)] flex flex-col">
            <header className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Support Desk</h1>
                    <p className="text-slate-500 mt-1">Manage user inquiries and issues.</p>
                </div>
            </header>

            <div className="flex bg-white rounded-[32px] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex-1 min-h-0">

                {/* Left Sidebar: Ticket List */}
                <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-brand-blue"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-10 text-slate-400 text-xs">Loading requests...</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">No tickets found</div>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setActiveTicket(ticket)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${activeTicket?.id === ticket.id ? 'bg-white border-brand-blue shadow-md z-10' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm truncate pr-2 ${activeTicket?.id === ticket.id ? 'text-brand-blue' : 'text-slate-800'}`}>
                                            {ticket.user?.name || "Unknown User"}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-500' :
                                                    'bg-orange-100 text-orange-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 mb-1 truncate">{ticket.subject}</p>
                                    <p className="text-xs text-slate-400 line-clamp-1">
                                        {ticket.messages[ticket.messages.length - 1]?.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Area: Chat Interface */}
                {activeTicket ? (
                    <div className="w-full md:w-2/3 flex flex-col bg-white">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-sm">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{activeTicket.subject}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <User size={12} /> {activeTicket.user?.name} ({activeTicket.user?.phone || "No phone"})
                                    <span className="mx-1">•</span>
                                    <span>#{activeTicket.id.slice(-6)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {activeTicket.status !== 'CLOSED' && (
                                    <button
                                        onClick={() => handleStatusChange('CLOSED')}
                                        className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                                    >
                                        <CheckCircle2 size={14} /> Close Ticket
                                    </button>
                                )}
                                {activeTicket.status === 'CLOSED' && (
                                    <button
                                        onClick={() => handleStatusChange('OPEN')}
                                        className="text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
                                    >
                                        <AlertCircle size={14} /> Reopen
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                            {activeTicket.messages.map((msg: any) => {
                                const isAdmin = msg.sender === 'ADMIN';
                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            {isAdmin ? <LifeBuoy size={14} /> : <User size={14} />}
                                        </div>
                                        <div className={`max-w-[80%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <span className="text-[10px] font-bold text-slate-500">{isAdmin ? 'Support Agent' : 'User'}</span>
                                                <span className="text-[10px] text-slate-400">
                                                    {msg.createdAt instanceof Date ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={`p-4 rounded-2xl text-sm ${isAdmin ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white shadow-sm border border-slate-100 rounded-tl-none text-slate-700'
                                                }`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 bg-white border-t border-slate-100 z-10">
                            <form onSubmit={handleReply} className="flex gap-3">
                                <input
                                    value={replyMessage}
                                    onChange={e => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-brand-blue"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyMessage.trim()}
                                    className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-center p-10 text-slate-400 bg-white">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">Select a Ticket</h3>
                        <p className="text-sm max-w-xs mx-auto mt-2">Choose a ticket from the left sidebar to view conversation details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
