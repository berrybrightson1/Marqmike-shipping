"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, action, isVisible, onClose }: ToastProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={cn(
                        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
                        "flex items-center gap-3 px-6 py-3",
                        "bg-black/80 backdrop-blur-md border border-white/10",
                        "rounded-full shadow-2xl"
                    )}
                >
                    <span className="text-white text-sm font-medium tracking-wide">
                        {message}
                    </span>

                    {action && (
                        <button
                            onClick={action.onClick}
                            className="text-yellow-400 text-sm font-bold hover:text-yellow-300 transition-colors"
                        >
                            {action.label}
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        aria-label="Close notification"
                        className="ml-2 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
