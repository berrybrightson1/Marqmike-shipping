"use client";

import { useRef, useEffect, KeyboardEvent } from "react";

interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    onComplete?: () => void;
    disabled?: boolean;
    length?: number;
}

export default function OTPInput({
    value,
    onChange,
    onComplete,
    disabled = false,
    length = 6
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        // Auto-submit when complete
        if (value.length === length && onComplete) {
            onComplete();
        }
    }, [value, length, onComplete]);

    const handleChange = (index: number, digit: string) => {
        if (disabled) return;

        // Only allow single digit
        const newDigit = digit.replace(/[^0-9]/g, "").slice(-1);

        // Update value
        const newValue = value.split("");
        newValue[index] = newDigit;
        const updatedValue = newValue.join("").slice(0, length);
        onChange(updatedValue);

        // Auto-focus next input
        if (newDigit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // If current is empty, focus previous
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current digit
                const newValue = value.split("");
                newValue[index] = "";
                onChange(newValue.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
        onChange(pastedData);

        // Focus the last filled input
        const nextIndex = Math.min(pastedData.length, length - 1);
        setTimeout(() => {
            inputRefs.current[nextIndex]?.focus();
        }, 0);
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    aria-label={`Digit ${index + 1}`}
                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
            ))}
        </div>
    );
}
