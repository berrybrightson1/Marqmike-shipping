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
            {/* Unified Container */}
            <div
                className={`
                    flex items-center w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2
                    focus-within:ring-2 focus-within:ring-brand-pink/20 focus-within:border-brand-pink/50 
                    transition-all
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {/* Country Selector Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                    className="flex items-center gap-2 pr-3 border-r border-slate-200 hover:bg-slate-100/50 py-2 -ml-2 pl-2 rounded-lg transition-colors flex-shrink-0"
                >
                    {/* Circular Flag Container */}
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <selectedCountry.flag title={selectedCountry.country} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-slate-700">{selectedCountry.code}</span>
                    <ChevronDown className="text-slate-400" size={16} />
                </button>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={formatPhoneDisplay()}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
                    placeholder="123456789"
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none px-4 py-2 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 w-full"
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for countries"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                            />
                        </div>
                    </div>

                    {/* Country List */}
                    <div className="max-h-64 overflow-y-auto scrollbar-hide">
                        <style jsx>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                            .scrollbar-hide {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        {filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="w-6 h-4 shadow-sm overflow-hidden rounded-[2px] flex-shrink-0">
                                    <country.flag title={country.country} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">{country.country}</p>
                                    <p className="text-xs text-slate-500">{country.code}</p>
                                </div>
                                {selectedCountry.code === country.code && (
                                    <Check className="text-brand-blue" size={18} />
                                )}
                            </button>
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
