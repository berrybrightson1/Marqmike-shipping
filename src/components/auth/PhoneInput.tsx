"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { US, GB, GH, NG, KE, ZA, DE } from 'country-flag-icons/react/3x2';

interface Country {
    code: string;
    country: string;
    flag: React.ElementType;
    digits: string;
}

const countries: Country[] = [
    { code: "+233", country: "Ghana", flag: GH, digits: "233" },
    { code: "+234", country: "Nigeria", flag: NG, digits: "234" },
    { code: "+1", country: "United States", flag: US, digits: "1" },
    { code: "+44", country: "United Kingdom", flag: GB, digits: "44" },
    { code: "+254", country: "Kenya", flag: KE, digits: "254" },
    { code: "+27", country: "South Africa", flag: ZA, digits: "27" },
    { code: "+49", country: "Germany", flag: DE, digits: "49" },
];

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    onEnter?: () => void;
    disabled?: boolean;
}

export default function PhoneInput({ value, onChange, onEnter, disabled }: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-detect country from phone number
    useEffect(() => {
        if (value) {
            const matchedCountry = countries.find((c) =>
                value.replace(/\s/g, "").startsWith(c.digits)
            );
            if (matchedCountry && matchedCountry.code !== selectedCountry.code) {
                setSelectedCountry(matchedCountry);
            }
        }
    }, [value]);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery("");

        // Update phone number with new country code
        const phoneWithoutCode = value.replace(/^\+?\d{1,4}\s*/, "");
        onChange(country.digits + phoneWithoutCode);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, "");
        onChange(input);
    };

    const filteredCountries = countries.filter((country) =>
        country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.includes(searchQuery)
    );

    const formatPhoneDisplay = () => {
        if (!value) return "";
        const phoneWithoutCode = value.replace(selectedCountry.digits, "");
        return phoneWithoutCode;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Unified Container - Glassmorphic Style */}
            <div
                className={`
                    flex items-center w-full bg-[#003d91]/60 backdrop-blur-md border border-white/5 rounded-3xl px-4 py-1 h-16
                    focus-within:ring-2 focus-within:ring-brand-pink/50 focus-within:border-brand-pink/50
                    transition-all
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {/* Country Selector Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="flex items-center gap-3 pr-4 py-3 -ml-2 pl-2 rounded-xl transition-colors flex-shrink-0 hover:bg-white/5"
                >
                    {/* Circular Flag Container */}
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <selectedCountry.flag title={selectedCountry.country} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white text-lg">{selectedCountry.code}</span>
                    <ChevronDown className="text-white/40" size={20} />
                </button>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={formatPhoneDisplay()}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
                    placeholder="123 456 789"
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none px-4 py-2 font-mono text-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-0 w-full"
                />
            </div>

            {/* Dropdown Menu - Dark Glass */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#001e4d]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    {/* Country List */}
                    <div className="max-h-64 overflow-y-auto no-scrollbar">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                            >
                                <div className="w-8 h-6 shadow-sm overflow-hidden rounded-[4px] flex-shrink-0">
                                    <country.flag title={country.country} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-bold text-white/90">{country.country}</p>
                                    <p className="text-xs text-white/40 font-mono tracking-wide">{country.code}</p>
                                </div>
                                {selectedCountry.code === country.code && (
                                    <Check className="text-[#ff1493]" size={20} />
                                )}
                            </button>
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="px-4 py-8 text-center text-white/40 text-sm">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
