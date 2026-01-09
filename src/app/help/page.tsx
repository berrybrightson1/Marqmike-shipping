"use client";

import { useState } from "react";
import { Search, HelpCircle, Package, Shield, BookOpen, User, MapPin, ChevronRight, ExternalLink } from "lucide-react";

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // FAQ and Guide Data
    const guides = [
        {
            category: "Getting Started",
            icon: BookOpen,
            color: "bg-blue-100 text-blue-600",
            items: [
                {
                    title: "How to create an account",
                    content: [
                        "Click the 'Sign Up' button in the top navigation",
                        "Choose your sign-up method: Google (recommended), Email, or Phone",
                        "If using Google: Click 'Continue with Google' and select your account",
                        "If using Email: Enter your email and click the verification link sent to you",
                        "Complete your profile by adding your phone number and delivery address",
                        "You're all set! Start browsing our catalog or track your shipments"
                    ],
                    tags: ["account", "signup", "register"]
                },
                {
                    title: "Verifying your phone number",
                    content: [
                        "Go to 'Settings' from your dashboard bottom navigation",
                        "Tap on 'Profile' in the settings menu",
                        "Click 'Add Phone Number'",
                        "Enter your Ghana number in format: +233 XX XXX XXXX",
                        "Click 'Send Code' and wait for the SMS",
                        "Enter the 6-digit verification code",
                        "Your phone is now verified and we can contact you for deliveries!"
                    ],
                    tags: ["phone", "verification", "sms", "settings"]
                }
            ]
        },
        {
            category: "How to Buy",
            icon: Package,
            color: "bg-green-100 text-green-600",
            items: [
                {
                    title: "Buying from our Stock",
                    content: [
                        "Visit the 'Store' page from the dashboard or homepage",
                        "Browse products or use the search bar to find specific items",
                        "Click on any product card to view full details",
                        "Review the price in your preferred currency (RMB/GHS/USD)",
                        "Check the CBM (shipping volume) by expanding the calculator",
                        "Select your quantity using the +/- buttons",
                        "Click 'Order via WhatsApp'",
                        "Fill in your phone number and delivery location",
                        "Click 'Continue on WhatsApp' to finalize your order with our team",
                        "You'll receive a unique reference code (e.g., MQM-XXXX) for tracking"
                    ],
                    tags: ["buy", "store", "shop", "purchase", "whatsapp"]
                },
                {
                    title: "'Buy For Me' Service Explained",
                    content: [
                        "This service is perfect when you can't find an item in our store",
                        "Find the product on 1688, Taobao, Alibaba, or any Chinese marketplace",
                        "Copy the product URL (the link in your browser)",
                        "Go to 'Buy For Me' from your dashboard",
                        "Paste the link in the 'Product Link' field",
                        "Enter the quantity you need",
                        "Click 'Request Quote'",
                        "Our team will verify availability and calculate total cost (product + shipping)",
                        "You'll receive a quote within 24 hours via WhatsApp",
                        "Once approved, we purchase, ship, and deliver to Ghana!",
                        "💡 Tip: Send multiple links at once for bulk orders"
                    ],
                    tags: ["buy for me", "procurement", "1688", "taobao", "alibaba", "quote"]
                }
            ]
        },
        {
            category: "Shipping & Tracking",
            icon: MapPin,
            color: "bg-pink-100 text-pink-600",
            items: [
                {
                    title: "What is CBM and why does it matter?",
                    content: [
                        "CBM stands for Cubic Meter – it measures the volume of your shipment",
                        "Formula: CBM = Length (m) × Width (m) × Height (m)",
                        "Example: A phone case (16cm × 8cm × 1cm) = 0.000128 m³",
                        "Shipping costs are calculated based on CBM, not just weight",
                        "Lower CBM = Lower shipping cost",
                        "Tip: Order similar-sized items together to optimize space",
                        "Our system automatically calculates total CBM when you add to cart",
                        "You can view CBM breakdown on each product detail page"
                    ],
                    tags: ["cbm", "shipping", "cost", "volume", "calculator"]
                },
                {
                    title: "How to track your shipment",
                    content: [
                        "From your dashboard, tap 'Track' in the bottom navigation",
                        "Or visit the public tracking page at /track",
                        "Enter your Waybill Number (e.g., MQM-8821) in the search box",
                        "Click the search button (or press Enter)",
                        "View the shipment timeline with all status updates",
                        "If logged in as the owner, you'll see full delivery details",
                        "If viewing as a guest, you'll see location (city) but not exact addresses for privacy",
                        "Refresh the page to see the latest updates",
                        "For urgent inquiries, contact support via WhatsApp"
                    ],
                    tags: ["tracking", "waybill", "shipment", "status", "timeline"]
                },
                {
                    title: "Prohibited Items List",
                    content: [
                        "⚠️ We CANNOT ship the following items due to international regulations:",
                        "❌ Lithium Batteries (power banks, spare batteries)",
                        "❌ Liquids (perfumes, oils, chemicals, beverages)",
                        "❌ Weapons & Ammunition (including replicas)",
                        "❌ Flammable/Explosive materials (lighters, aerosols)",
                        "❌ Counterfeit or illegal goods",
                        "❌ Perishable food items",
                        "❌ Live animals or plants",
                        "If you're unsure whether an item is allowed, contact us BEFORE ordering",
                        "Sending prohibited items may result in confiscation and shipping delays"
                    ],
                    tags: ["prohibited", "banned", "restricted", "illegal", "not allowed"]
                }
            ]
        },
        {
            category: "Account & Settings",
            icon: User,
            color: "bg-purple-100 text-purple-600",
            items: [
                {
                    title: "Managing your saved addresses",
                    content: [
                        "Go to 'Settings' → 'Saved Addresses'",
                        "Click 'Add New Address'",
                        "Fill in recipient name, phone, city, and detailed address",
                        "Toggle 'Set as Default' if this is your primary delivery location",
                        "Click 'Save Address'",
                        "To edit: Tap the address card and update details",
                        "To delete: Swipe left (mobile) or click the trash icon",
                        "Your default address will auto-fill during checkout"
                    ],
                    tags: ["address", "delivery", "settings", "save", "default"]
                },
                {
                    title: "Switching currencies (RMB/GHS/USD)",
                    content: [
                        "Look for the currency pill (usually top-right on store pages)",
                        "Click the currency pill to open the selector",
                        "Choose RMB (Chinese Yuan), GHS (Ghanaian Cedi), or USD (US Dollar)",
                        "All prices will update instantly",
                        "Your selection is saved for future visits",
                        "Exchange rates are updated daily",
                        "Note: Final payments are processed in the currency you select at checkout"
                    ],
                    tags: ["currency", "rmb", "ghs", "usd", "exchange", "price"]
                }
            ]
        },
        {
            category: "Support & Contact",
            icon: HelpCircle,
            color: "bg-orange-100 text-orange-600",
            items: [
                {
                    title: "How to contact support",
                    content: [
                        "Primary: WhatsApp at +233 551 171 353 (fastest response)",
                        "From the app: Dashboard → 'Get Quote' → WhatsApp button",
                        "Email: support@marqmike.com (24-48 hour response time)",
                        "Submit a ticket: Settings → 'Support' → 'Create Ticket'",
                        "Business hours: Mon-Fri, 9AM-6PM Ghana Time (GMT)",
                        "Emergency tracking inquiries: Available 24/7 via WhatsApp",
                        "Please include your order/tracking number when contacting us"
                    ],
                    tags: ["support", "contact", "whatsapp", "help", "email", "ticket"]
                }
            ]
        }
    ];

    // Filter guides based on search
    const filteredGuides = guides.map(category => ({
        ...category,
        items: category.items.filter(item =>
            searchQuery === "" ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.content.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-br from-brand-blue to-[#003d91] pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-brand-pink/20 rounded-full blur-[100px]" />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <HelpCircle size={64} className="text-white/90 mx-auto mb-6" strokeWidth={1.5} />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
                    <p className="text-white/70 text-lg">Everything you need to know about MarqMike Shipping</p>
                </div>
            </header>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto px-6 -mt-12 relative z-20 mb-8">
                <div className="bg-white rounded-2xl shadow-2xl border border-white/60 p-2 flex items-center gap-3">
                    <Search className="text-slate-400 ml-4" size={24} />
                    <input
                        type="text"
                        placeholder="Search for help... (e.g., 'how to track', 'CBM calculator', 'buy for me')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 py-4 px-2 bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 text-lg"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mr-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 space-y-6">
                {filteredGuides.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No results found for "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-brand-blue hover:text-brand-pink transition-colors font-bold"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    filteredGuides.map((category, idx) => (
                        <section key={idx} className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 ${category.color} rounded-2xl`}>
                                    <category.icon size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">{category.category}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.items.map((item, itemIdx) => (
                                    <details key={itemIdx} className="group border-b border-slate-100 last:border-none py-4">
                                        <summary className="flex items-center justify-between cursor-pointer list-none">
                                            <span className="font-bold text-slate-700 group-open:text-brand-blue transition-colors flex items-center gap-2">
                                                <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                                                {item.title}
                                            </span>
                                        </summary>
                                        <div className="mt-4 ml-6 space-y-3">
                                            {item.content.map((line, lineIdx) => (
                                                <div key={lineIdx} className={`flex gap-3 ${line.startsWith("❌") || line.startsWith("⚠️") ? "text-red-600" : line.startsWith("💡") ? "text-brand-blue font-medium" : "text-slate-600"}`}>
                                                    {!line.startsWith("❌") && !line.startsWith("⚠️") && !line.startsWith("💡") && !line.match(/^(Tip:|Example:|Note:|Formula:)/i) && (
                                                        <span className="text-brand-blue font-bold">{lineIdx + 1}.</span>
                                                    )}
                                                    <span className="flex-1 leading-relaxed text-sm">{line}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    ))
                )}

                {/* Still Need Help? */}
                <div className="bg-gradient-to-br from-brand-pink to-pink-600 text-white rounded-[32px] p-8 text-center shadow-xl shadow-pink-200">
                    <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
                    <p className="text-white/90 mb-6">Our support team is here for you 24/7</p>
                    <a
                        href="https://wa.me/233551171353"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-brand-pink px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-lg"
                    >
                        <ExternalLink size={20} />
                        Contact Us on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
