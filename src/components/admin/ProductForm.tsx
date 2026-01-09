"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
// We will implement the server action `createProduct` later or mock it for now
// import { createProduct } from "@/app/actions/product"; 

export default function ProductForm() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressionStats, setCompressionStats] = useState<{ original: string; compressed: string; saved: string } | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset
        setImageFile(null);
        setCompressionStats(null);
        setIsCompressing(true);

        try {
            // Stats before
            const originalSize = (file.size / 1024 / 1024).toFixed(2) + " MB";

            // Compression Config
            const options = {
                maxSizeMB: 0.1, // Target 100KB
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: "image/webp",
                initialQuality: 0.7
            };

            const compressedFile = await imageCompression(file, options);

            // Stats after
            const compressedSize = (compressedFile.size / 1024).toFixed(0) + " KB";
            const savedPercentage = ((1 - compressedFile.size / file.size) * 100).toFixed(0) + "%";

            setCompressionStats({
                original: originalSize,
                compressed: compressedSize,
                saved: savedPercentage
            });

            setImageFile(compressedFile);
            setPreviewUrl(URL.createObjectURL(compressedFile));
            toast.success("Image optimized!", {
                description: `Reduced by ${savedPercentage} (${originalSize} -> ${compressedSize})`
            });

        } catch (error) {
            console.error("Compression Error:", error);
            toast.error("Failed to compress image");
        } finally {
            setIsCompressing(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        setCompressionStats(null);
    };

    return (
        <form action={async (formData) => {
            // We'll append the compressed file to formData manually or assume logic handles it if supported
            // For now just console log
            if (!imageFile) {
                toast.error("Please select an image");
                return;
            }
            toast.info("Uploading product... (Mock)");
            // Here we would call createProduct(formData)
        }} className="space-y-8">

            {/* Image Upload Area */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product Image</label>

                {!previewUrl ? (
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isCompressing}
                        />
                        <div className={`border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 transition-colors ${isCompressing ? 'opacity-50' : 'group-hover:bg-slate-100 group-hover:border-brand-blue/50'}`}>
                            {isCompressing ? (
                                <Loader2 className="animate-spin text-brand-blue mb-4" size={32} />
                            ) : (
                                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-blue mb-4 group-hover:scale-110 transition-transform">
                                    <CloudUploadIcon />
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-slate-700">
                                {isCompressing ? "Optimizing..." : "Drop image here"}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                                {isCompressing ? "Crunching pixels to 100KB" : "Auto-compressed to ~100KB WebP"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full aspect-video md:w-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-slate-600 hover:text-red-500 shadow-sm transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Compression Badge */}
                        {compressionStats && (
                            <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md rounded-xl p-3 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Check size={14} className="text-green-400" />
                                    <span className="text-xs font-bold text-green-400">Saved {compressionStats.saved} Data</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                                    <span>Original: {compressionStats.original}</span>
                                    <span>→</span>
                                    <span className="text-white font-bold">{compressionStats.compressed}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="e.g. iPhone 15 Pro Max Case"
                        className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Category</label>
                    <select name="category" className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-brand-blue/20 outline-none">
                        <option>Electronics</option>
                        <option>Fashion</option>
                        <option>Home & Living</option>
                        <option>Beauty</option>
                    </select>
                </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Price (RMB)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
                        <input
                            name="priceRMB"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full p-4 pl-10 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Total CBM</label>
                    <input
                        name="cbm"
                        type="number"
                        step="0.0001"
                        placeholder="0.005"
                        className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
                <SubmitButton />
            </div>

        </form>
    );
}

function CloudUploadIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-xl shadow-brand-blue/30 hover:bg-[#003d91] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending ? <Loader2 className="animate-spin" /> : "Upload Product"}
        </button>
    )
}
