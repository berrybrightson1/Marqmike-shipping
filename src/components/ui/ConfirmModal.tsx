"use client";

import { Loader2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
    loading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm p-8 transform scale-100 animate-in zoom-in-95 duration-200 pointer-events-auto border border-white/20">
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-sora">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDestructive
                                ? "bg-red-600 hover:bg-red-700 shadow-red-500/30"
                                : "bg-brand-blue hover:bg-blue-700 shadow-blue-500/30"
                                }`}
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
