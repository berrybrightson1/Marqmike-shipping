"use client";

import ProductForm from "@/components/admin/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-32">
            <header className="flex flex-col gap-4">
                <Link href="/admin/inventory" className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors w-fit">
                    <ChevronLeft size={18} />
                    <span className="font-bold text-sm">Back to Inventory</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Creator Studio</h1>
                    <p className="text-slate-500 mt-1">Upload new products to the Global Store.</p>
                </div>
            </header>

            {/* Form Section */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50">
                <ProductForm />
            </div>
        </div>
    );
}
