"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, ScanLine, DollarSign, LogOut, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { toast } from "sonner";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DashboardHeaderProps {
    user?: {
        name: string | null;
        [key: string]: any;
    } | null;
    title?: string;
    showBack?: boolean;
    backLink?: string;
}

export default function DashboardHeader({ user, title = "My Shipments", showBack = false, backLink }: DashboardHeaderProps) {
    const { currency, setCurrency } = useCurrency();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [greeting, setGreeting] = useState("Good Day");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        if (showNotifs) {
            import("@/app/actions/notification").then(({ getUserNotifications }) => {
                getUserNotifications().then(res => {
                    if (res.success) setNotifications(res.data);
                });
            });
        }
    }, [showNotifs]);

    // Refs for click outside
    const notifRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLFormElement>(null);

    useClickOutside(notifRef, () => setShowNotifs(false));
    useClickOutside(searchRef, () => {
        if (searchTerm) setSearchTerm("");
    });

    const toggleCurrency = () => {
        if (currency === 'USD') setCurrency('GHS');
        else if (currency === 'GHS') setCurrency('NGN');
        else setCurrency('USD');
    };



    const handleBack = () => {
        if (backLink) {
            router.push(backLink);
        } else {
            router.back();
        }
    };

    return (
        <div className="relative">
            {/* Background Layer (Clipped) */}
            <div className="absolute inset-0 bg-brand-blue rounded-b-[40px] overflow-hidden z-0 h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            </div>

            {/* Content & Height Wrapper */}
            <div className="pt-8 pb-20 px-6">
                <div className="relative z-20 flex flex-col gap-6">

                    {/* 1. TOP: Greeting (Centered or Left) */}
                    {/* 1. TOP: Greeting (Centered with Animation) */}
                    <div className="flex justify-center mb-2">
                        <div className="relative group cursor-default">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-white/20 rounded-full blur-md animate-pulse opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            {/* Badge */}
                            <div className="relative bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg animate-in slide-in-from-top-4 fade-in duration-1000 flex items-center gap-2.5">
                                <span className="animate-spin-slow text-sm">☀️</span>
                                <span className="text-white text-xs font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                                    {greeting}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2. MIDDLE: Main Nav (Logo, User, Actions) - Pushed Down */}
                    <div className="flex justify-between items-center">
                        {/* Left Side: Logo/User or Back */}
                        {showBack ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleBack}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h1 className="text-xl text-white font-bold">{title}</h1>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 relative overflow-hidden bg-white shadow-lg shadow-black/10">
                                    <img src="/logos/logo-icon.svg" alt="Marqmike" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-[10px] font-bold tracking-wide uppercase mb-0.5">Welcome</p>
                                    <h2 className="text-white text-xl font-bold leading-none">{user?.name ? user.name.split(" ")[0] : "Guest"}</h2>
                                </div>
                            </div>
                        )}

                        {/* Right Side: Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={toggleCurrency}
                                className="h-10 px-3 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors gap-1.5 backdrop-blur-sm"
                            >
                                <DollarSign size={14} className="text-brand-pink" />
                                <span className="text-xs font-bold">{currency}</span>
                            </button>

                            <div className="relative" ref={notifRef}>
                                <button
                                    aria-label="Notifications"
                                    onClick={() => setShowNotifs(!showNotifs)}
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors relative backdrop-blur-sm"
                                >
                                    <Bell size={20} />
                                    {notifications.some(n => !n.read) && (
                                        <div className="absolute top-2 right-2.5 w-2 h-2 bg-brand-pink rounded-full border border-brand-blue" />
                                    )}
                                </button>
                                {showNotifs && (
                                    <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl shadow-brand-blue/20 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 ring-1 ring-slate-100">
                                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Notifications</span>
                                            </div>
                                            <Link href="/dashboard/notifications" onClick={() => setShowNotifs(false)} className="text-[10px] font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1">
                                                View All <ScanLine size={10} />
                                            </Link>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <Bell size={18} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-xs font-medium">No new notifications</p>
                                                </div>
                                            ) : notifications.slice(0, 5).map((n) => <NotificationItem key={n.id} notification={n} />)}
                                        </div>
                                        <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 right-0" />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* 3. BOTTOM: Search Bar */}
                    <form ref={searchRef} onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
                        if (input) {
                            router.push(`/dashboard?search=${encodeURIComponent(input)}`);
                            setSearchTerm("");
                        }
                    }} className="relative group mt-2">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            <Search size={20} />
                        </div>
                        <input
                            name="search"
                            type="text"
                            placeholder="Tracking #"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:bg-black/30 transition-all font-medium"
                            autoComplete="off"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                            <ScanLine size={20} />
                        </div>

                        {searchTerm && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-brand-blue rounded-3xl shadow-2xl overflow-hidden border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-colors text-left group">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                            <Search size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">Search for "{searchTerm}"</p>
                                            <p className="text-white/50 text-[10px]">Search global inventory</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

function NotificationItem({ notification }: { notification: any }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={`
                p-4 border-b border-slate-50 last:border-0 transition-all cursor-pointer text-left group
                ${expanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}
                ${!notification.read ? 'bg-blue-50/50' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2">
                    {!notification.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />}
                    <span className={`font-bold text-sm text-slate-800 ${expanded ? 'text-brand-blue' : ''}`}>
                        {notification.title}
                    </span>
                </div>
            </div>

            <p className={`
                text-xs text-slate-500 leading-relaxed transition-all duration-300
                ${expanded ? '' : 'line-clamp-1 opacity-80'}
            `}>
                {notification.message}
            </p>
        </div>
    )
}
