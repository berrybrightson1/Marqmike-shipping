"use client";

import { Package, ShoppingCart, Calculator, HelpCircle, MapPin } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
    icon: any;
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}

function ActionButton({ icon: Icon, label, href, onClick, active }: ActionButtonProps) {
    const content = (
        <>
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
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="flex flex-col items-center gap-2 group">
                {content}
            </button>
        );
    }

    return (
        <Link href={href || "#"} className="flex flex-col items-center gap-2 group">
            {content}
        </Link>
    );
}

import { useState } from "react";
// Modal removed in favor of dedicated page

export default function ActionGrid() {

    const actions = [
        { label: "Calculator", icon: Calculator, href: "/dashboard/create", active: true },
        { label: "Buy For Me", icon: ShoppingCart, href: "/dashboard/buy-for-me", active: false },
        { label: "Check Address", icon: MapPin, href: "/dashboard/address", active: false },
        { label: "Help Center", icon: HelpCircle, href: "/help", active: false },
    ];

    return (
        <>
            <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-4 rounded-[32px] shadow-[0_8px_32px_rgba(0,73,173,0.15)] ring-1 ring-white/60 flex justify-between items-center relative overflow-hidden">
                {actions.map((action) => (
                    <ActionButton
                        key={action.label}
                        {...action}
                    />
                ))}
            </div>
        </>
    );
}
