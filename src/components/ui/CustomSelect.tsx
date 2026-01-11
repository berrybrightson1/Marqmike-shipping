"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label?: string;
    className?: string; // For option-specific coloring
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string; // Wrapper class
    buttonClassName?: string; // Button overrides
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    className = "",
    buttonClassName = ""
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white
                    text-sm font-bold text-slate-700 transition-all active:scale-95 mb-1
                    ${isOpen ? 'ring-2 ring-brand-blue/20 border-brand-blue' : 'hover:border-slate-300'}
                    ${buttonClassName}
                `}
            >
                <span className="truncate">{selectedOption?.label || selectedOption?.value || placeholder}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full text-left px-3 py-2 text-sm font-bold flex items-center justify-between gap-2 transition-colors
                                    ${option.value === value ? 'bg-brand-blue/5 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}
                                    ${option.className || ''}
                                `}
                            >
                                <span className="truncate">{option.label || option.value}</span>
                                {option.value === value && <Check size={14} className="text-brand-blue shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
