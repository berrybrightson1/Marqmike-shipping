"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { MessageSquare, Plus, Send, User, LifeBuoy } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createTicket, getUserTickets, addReply } from "@/app/actions/support";
import { toast } from "sonner";
import { getRelativeTime } from "@/lib/utils";

export default function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openNewTicket, setOpenNewTicket] = useState(false);

    // New Ticket Form
    const [newSubject, setNewSubject] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Reply Form
    const [replyMessage, setReplyMessage] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket, activeTicket?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadTickets = async () => {
        setLoading(true);
        const res = await getUserTickets();
        if (res.success) {
            setTickets(res.data);
            if (activeTicket) {
                // Update active ticket data if it exists in the new list
                const updated = res.data.find((t: any) => t.id === activeTicket.id);
                if (updated) setActiveTicket(updated);
            }
        }
        setLoading(false);
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("subject", newSubject);
        formData.append("message", newMessage);
        formData.append("priority", "MEDIUM");

        const res = await createTicket(formData);

        if (res.success && res.ticketId) {
            toast.success("Ticket created successfully");
            setOpenNewTicket(false);
            setNewSubject("");
            setNewMessage("");
            await loadTickets();
            // Automatically select the new ticket
            const newTicket = tickets.find(t => t.id === res.ticketId); // Might need refresh first, calling loadTickets above handles it but async
        } else {
            toast.error(res.error || "Failed to create ticket");
        }
        setSubmitting(false);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim()) return;

        const originalTicketId = activeTicket.id;

        // Optimistic update
        const tempMsg = {
            id: 'temp-' + Date.now(),
            sender: 'USER',
            message: replyMessage,
            createdAt: new Date()
        };

        setActiveTicket({
            ...activeTicket,
            messages: [...activeTicket.messages, tempMsg]
        });
        setReplyMessage("");

        const res = await addReply(originalTicketId, tempMsg.message, "USER");
        if (res.success) {
            loadTickets(); // Refresh for real ID
        } else {
            toast.error("Failed to send reply");
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-10">
            <DashboardHeader title="Support Center" showBack={true} backLink="/dashboard" />

            <div className="px-6 -mt-16 relative z-10 max-w-6xl mx-auto h-[calc(100vh-140px)] min-h-[600px] flex gap-6">

                {/* Left Sidebar: Ticket List */}
                <div className="w-full md:w-1/3 bg-white rounded-[32px] shadow-xl shadow-slate-200 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-slate-800">My Tickets</h2>
                            <p className="text-xs text-slate-500">History & Status</p>
                        </div>
                        <button
                            onClick={() => { setOpenNewTicket(true); setActiveTicket(null); }}
                            className="bg-brand-blue/10 text-brand-blue p-2 rounded-xl hover:bg-brand-blue/20 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-10 text-slate-400 text-xs">Loading...</div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                    <LifeBuoy size={24} />
                                </div>
                                <p className="text-sm font-bold text-slate-600">No tickets yet</p>
                                <p className="text-xs text-slate-400 mt-1">Start a conversation if you need help.</p>
                                <button
                                    onClick={() => setOpenNewTicket(true)}
                                    className="mt-4 text-xs font-bold text-brand-blue bg-blue-50 px-4 py-2 rounded-lg"
                                >
                                    Open Ticket
                                </button>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => { setActiveTicket(ticket); setOpenNewTicket(false); }}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeTicket?.id === ticket.id ? 'bg-brand-blue/5 border-brand-blue/20 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm truncate ${activeTicket?.id === ticket.id ? 'text-brand-blue' : 'text-slate-800'}`}>
                                            {ticket.subject}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-500' :
                                                    'bg-orange-100 text-orange-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                                        {ticket.messages[ticket.messages.length - 1]?.message || "No messages"}
                                    </p>
                                    <div className="text-[10px] text-slate-400">
                                        {new Date(ticket.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Area: Chat/Form */}
                <div className="w-full md:w-2/3 bg-white rounded-[32px] shadow-xl shadow-slate-200 overflow-hidden flex flex-col relative">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    {openNewTicket ? (
                        <div className="p-8 max-w-lg mx-auto w-full h-full flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Ticket</h2>
                            <p className="text-slate-500 text-sm mb-6">Describe your issue and we'll get back to you shortly.</p>

                            <form onSubmit={handleCreateTicket} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                                    <select
                                        value={newSubject}
                                        onChange={e => setNewSubject(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-brand-blue"
                                        required
                                    >
                                        <option value="">Select a Topic...</option>
                                        <option value="Order Status">Order Status Inquiry</option>
                                        <option value="Shipping Quote">Shipping Quote Question</option>
                                        <option value="Payment Issue">Payment/Wallet Issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Message</label>
                                    <textarea
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-brand-blue h-32 resize-none"
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setOpenNewTicket(false)}
                                        className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? "Sending..." : "Submit Ticket"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : activeTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm z-10">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{activeTicket.subject}</h3>
                                    <p className="text-xs text-slate-500">Ticket ID: #{activeTicket.id.slice(-6)}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${activeTicket.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {activeTicket.status}
                                </span>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                {activeTicket.messages.map((msg: any) => {
                                    const isUser = msg.sender === 'USER';
                                    return (
                                        <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-brand-blue text-white' : 'bg-orange-500 text-white'}`}>
                                                {isUser ? <User size={14} /> : <LifeBuoy size={14} />}
                                            </div>
                                            <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className={`p-4 rounded-2xl text-sm ${isUser ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white shadow-sm border border-slate-100 rounded-tl-none text-slate-700'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                    {msg.createdAt instanceof Date ? msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
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
                                        disabled={activeTicket.status === 'CLOSED'}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyMessage.trim() || activeTicket.status === 'CLOSED'}
                                        className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-slate-300"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-600">Select a Ticket</h3>
                            <p className="text-sm max-w-xs mx-auto mt-2">View details of your support requests or start a new one from the sidebar.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
