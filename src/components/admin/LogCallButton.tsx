"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import LogCallModal from "./LogCallModal";

export default function LogCallButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="absolute bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-14 h-14 bg-[#ff269b] rounded-full text-white shadow-xl shadow-brand-pink/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-90"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>
            <LogCallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}
