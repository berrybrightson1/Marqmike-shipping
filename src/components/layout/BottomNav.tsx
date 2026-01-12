"use client";

import { LayoutGrid, Calculator, Truck, ShoppingBag, Store, User, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();

    // Pages where BottomNav should be hidden
    // Strict Allowlist: Show ONLY on these main tabs
    const allowedExactRoutes = [
        "/dashboard",
        "/dashboard/tracking",
        "/dashboard/shipments",
        "/dashboard/profile",
    ];

    const isVisible = allowedExactRoutes.includes(pathname || "");

    if (!isVisible) return null;

    const navItems = [
        { label: "Feed", icon: LayoutGrid, href: "/dashboard" },
        { label: "Track", icon: Truck, href: "/dashboard/tracking" },
        { label: "Orders", icon: Package, href: "/dashboard/shipments" },
        { label: "Cart", icon: ShoppingBag, href: "/dashboard/cart" },
        { label: "Profile", icon: User, href: "/dashboard/profile" },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50">
            {/* Nav Container */}
            <div className="bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[32px] p-2 shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 flex justify-between items-center relative overflow-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex-1 flex flex-col items-center gap-1 py-2 relative"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-brand-blue/10 text-brand-blue" : "text-slate-400"} relative`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                {item.label === "Cart" && totalItems > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-brand-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </div>
                                )}
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

