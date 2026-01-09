import { BookOpen, HelpCircle, Package, Shield } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-[#F2F6FC] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-br from-brand-blue to-[#003d91] pt-12 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-brand-pink/20 rounded-full blur-[100px]" />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <HelpCircle size={64} className="text-white/90 mx-auto mb-6" strokeWidth={1.5} />
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
                    <p className="text-white/70 text-lg">Everything you need to know about MarqMike</p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 mt-8 space-y-6">
                {/* Getting Started */}
                <section className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 rounded-2xl">
                            <BookOpen size={24} className="text-brand-blue" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Getting Started</h2>
                    </div>

                    <Accordion
                        title="How to create an account"
                        content="Click 'Sign Up' at the top of the page. You can register using Google, email, or phone number. Once registered, you'll have access to your personal dashboard to track orders and view history."
                    />
                    <Accordion
                        title="Verifying your phone number"
                        content="After signing up, go to Settings > Profile. Click 'Add Phone Number' and enter your Ghana number (+233...). You'll receive an SMS code to verify. This helps us contact you for delivery updates."
                    />
                </section>

                {/* How to Buy */}
                <section className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-100 rounded-2xl">
                            <Package size={24} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">How to Buy</h2>
                    </div>

                    <Accordion
                        title="Buying from our Stock"
                        content="Visit the Store page and browse our catalog of ready-to-ship products from China. Click any item to view details, pricing (in RMB/GHS/USD), and CBM. Click 'Order via WhatsApp' to finalize—no payment gateway needed, we'll send you instructions directly."
                    />
                    <Accordion
                        title="'Buy For Me' Service"
                        content={
                            <div className="space-y-3">
                                <p>Can't find what you need in our Store? Use our 'Buy For Me' procurement service:</p>
                                <ol className="list-decimal list-inside space-y-2 text-sm">
                                    <li>Find the product on 1688, Taobao, or any Chinese marketplace</li>
                                    <li>Copy the product URL</li>
                                    <li>Paste it into our 'Buy For Me' form (coming soon) or send via WhatsApp</li>
                                    <li>We'll verify the price, calculate shipping (CBM), and send you a quote</li>
                                    <li>Approve, and we handle the rest—from purchase to Ghana delivery</li>
                                </ol>
                                <p className="text-brand-blue text-sm font-bold mt-4">💡 Perfect for bulk orders or hard-to-find items!</p>
                            </div>
                        }
                    />
                </section>

                {/* Shipping & Tracking */}
                <section className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-pink-100 rounded-2xl">
                            <Shield size={24} className="text-brand-pink" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Shipping & Tracking</h2>
                    </div>

                    <Accordion
                        title="What is CBM?"
                        content={
                            <div className="space-y-2">
                                <p className="font-bold text-brand-blue">CBM = Cubic Meter (Volume)</p>
                                <p>It's how we calculate shipping costs. Each product has a CBM value based on its size (Length × Width × Height in meters).</p>
                                <p className="text-sm text-slate-600 mt-3">
                                    <strong>Example:</strong> A phone case (16cm × 8cm × 1cm) = 0.000128 CBM.
                                    If you order 10 cases, Total CBM = 0.00128 m³. Lower CBM = Lower shipping cost!
                                </p>
                            </div>
                        }
                    />
                    <Accordion
                        title="Prohibited Items List"
                        content={
                            <div className="space-y-3">
                                <p className="text-red-600 font-bold">⚠️ We CANNOT ship the following:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                                    <li>Lithium Batteries (power banks, spare batteries)</li>
                                    <li>Liquids (perfumes, oils, chemicals)</li>
                                    <li>Weapons & Ammunition</li>
                                    <li>Flammable/Explosive materials</li>
                                    <li>Counterfeit or illegal goods</li>
                                </ul>
                                <p className="text-sm text-slate-500 mt-3">If unsure, contact us before ordering!</p>
                            </div>
                        }
                    />
                </section>
            </div>
        </div>
    );
}

// Simple Accordion Component
function Accordion({ title, content }: { title: string; content: React.ReactNode }) {
    return (
        <details className="group border-b border-slate-100 last:border-none py-4">
            <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-bold text-slate-700 group-open:text-brand-blue transition-colors">{title}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 text-slate-600 text-sm leading-relaxed">
                {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
        </details>
    );
}
