"use client";

import { Package, ShoppingCart, Calculator, HelpCircle } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
    icon: any;
    label: string;
    href: string;
    active?: boolean;
}

function ActionButton({ icon: Icon, label, href, active }: ActionButtonProps) {
    return (
        <Link href={href} className="flex flex-col items-center gap-2 group">
            <div
                className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm
                    ${active
                        ? "bg-brand-pink text-white shadow-brand-pink/30 shadow-lg"
                        : "bg-white border border-gray-100 text-brand-blue group-hover:bg-gray-50"
                    }
                `}
            >
                <Icon size={24} strokeWidth={2} />
            </div>
            <span className={`text-[10px] font-bold ${active ? "text-brand-pink" : "text-brand-blue"}`}>
                {label}
            </span>
        </Link>
    );
}

export default function ActionGrid() {
    const actions = [
        { label: "Delivery", icon: Package, href: "/dashboard/create", active: true },
        { label: "Buy For Me", icon: ShoppingCart, href: "/dashboard/procurement", active: false },
        { label: "Get Quote", icon: Calculator, href: "/dashboard/quote", active: false },
        { label: "Help Center", icon: HelpCircle, href: "/help", active: false },
    ];

    return (
        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-4 rounded-[32px] shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 flex justify-between items-center relative overflow-hidden">
            {/* Gradient Border Trick via Inner Shadow or Pseudo if needed, but ring-1 serves well for now */}
            {actions.map((action) => (
                <ActionButton
                    key={action.label}
                    {...action}
                />
            ))}
        </div>
    );
}
