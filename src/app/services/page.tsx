import { Package, Globe, Shield, Truck, Clock, Headphones } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC]">
            {/* Header */}
            <div className="bg-brand-blue pt-24 pb-20 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10" />
                <h1 className="text-4xl md:text-5xl font-black mb-4 relative z-10">Our Services</h1>
                <p className="text-white/70 max-w-2xl mx-auto relative z-10">Comprehensive logistics solutions for business and personal needs.</p>
            </div>

            {/* Services Grid */}
            <div className="max-w-6xl mx-auto px-6 py-20 -mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
                <ServiceCard
                    icon={Globe}
                    title="Global Procurement"
                    desc="We help you buy from verified suppliers in China, US, and UK. Submit a link, we handle the rest."
                />
                <ServiceCard
                    icon={Truck}
                    title="Air & Sea Freight"
                    desc="Flexible shipping options. Express Air (5-7 days) or Affordable Sea (30-45 days)."
                />
                <ServiceCard
                    icon={Shield}
                    title="Cargo Insurance"
                    desc="Full coverage for your goods against loss or damage during transit."
                />
                <ServiceCard
                    icon={Package}
                    title="Warehousing"
                    desc="Free storage in our Guangzhou warehouse for up to 30 days while you consolidate items."
                />
                <ServiceCard
                    icon={Clock}
                    title="Express Delivery"
                    desc="Door-to-door delivery services within Ghana (Accra & Kumasi)."
                />
                <ServiceCard
                    icon={Headphones}
                    title="24/7 Support"
                    desc="Dedicated customer service team available via WhatsApp and Phone."
                />
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Ready to ship?</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/signup" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Create Account</Link>
                    <Link href="/contact" className="bg-white text-brand-blue border border-brand-blue/20 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">Contact Sales</Link>
                </div>
            </div>
        </div>
    );
}

function ServiceCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-sm">{desc}</p>
        </div>
    )
}
