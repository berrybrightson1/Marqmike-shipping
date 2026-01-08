"use client";

import { LayoutGrid, Search, Truck, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Feed", icon: LayoutGrid, href: "/dashboard" },
        { label: "Search", icon: Search, href: "/dashboard/shipments" },
        { label: "Track", icon: Truck, href: "/dashboard/tracking" },
        { label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
        { label: "Cart", icon: ShoppingBag, href: "/dashboard/cart" },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-2 shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 flex justify-between items-center relative overflow-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex-1 flex flex-col items-center gap-1 py-2"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-brand-blue/10 text-brand-blue" : "text-slate-400"}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? "text-brand-blue font-bold" : "text-slate-400"}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

