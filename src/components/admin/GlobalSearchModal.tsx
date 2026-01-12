"use client";

import { useEffect, useState } from "react";
import { Search, Command, User, Package, Settings, ArrowRight, X, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalSearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setQuery("");
            setResults([]);
            return;
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                // Dynamic import to avoid server action issues in client component if strictly separated, though usually okay
                const { globalSearch } = await import("@/app/actions/search");
                const res = await globalSearch(query);
                if (res.success) {
                    setResults(res.results);
                }
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 300); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(href);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-start justify-center pt-32 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 slide-in-from-top-4">
                {/* Search Input */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
                    <Search className="text-slate-400" size={24} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for anything..."
                        className="flex-1 text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                            <Command size={10} /> K
                        </span>
                        <button aria-label="Close" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">
                            <Loader2 className="mx-auto mb-3 animate-spin" size={24} />
                            <p className="text-sm font-medium">Searching...</p>
                        </div>
                    ) : query === "" ? (
                        <div className="p-8 text-center text-slate-400">
                            <Command className="mx-auto mb-3 opacity-20" size={48} />
                            <p className="text-sm font-medium">Type to search across shipments, customers, and pages.</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((item, idx) => {
                                const Icon = item.icon === 'Package' ? Package : item.icon === 'User' ? User : item.icon === 'ShoppingCart' ? ShoppingCart : Settings;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(item.href)}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Page' ? 'bg-slate-100 text-slate-500' : item.type === 'Customer' ? 'bg-blue-50 text-brand-blue' : item.type === 'Shipment' ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-600'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-brand-blue transition-colors flex items-center gap-2">
                                                {item.title}
                                                {item.type !== 'Page' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-bold uppercase">{item.type}</span>}
                                            </h4>
                                            {item.desc && <p className="text-xs text-slate-400 font-medium">{item.desc}</p>}
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-3 text-[10px] font-bold text-slate-400 uppercase flex justify-between items-center border-t border-slate-100">
                    <span>Global Search</span>
                    <div className="flex gap-4">
                        <span>Navigate <span className="text-slate-600">↑↓</span></span>
                        <span>Select <span className="text-slate-600">Enter</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
