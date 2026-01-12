"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Upload, X, Check, Image as ImageIcon, Loader2, ChevronDown } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { createProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";

export default function ProductForm() {
    const router = useRouter();
    const [images, setImages] = useState<{ file: File; preview: string; base64: string; stats?: any }[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Limit total images
        if (images.length + files.length > 5) {
            toast.error("Maximum 5 images allowed");
            return;
        }

        setIsCompressing(true);
        const newImages: typeof images = [];

        try {
            // Process each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Stats before
                const originalSize = (file.size / 1024 / 1024).toFixed(2) + " MB";

                // Compression Config
                const options = {
                    maxSizeMB: 0.1, // Target 100KB
                    maxWidthOrHeight: 1280,
                    useWebWorker: true,
                    fileType: "image/webp",
                    initialQuality: 0.8
                };

                const compressedFile = await imageCompression(file, options);

                // Stats after
                const compressedSize = (compressedFile.size / 1024).toFixed(0) + " KB";
                const savedPercentage = ((1 - compressedFile.size / file.size) * 100).toFixed(0) + "%";

                // Convert to Base64
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(compressedFile);
                    reader.onloadend = () => resolve(reader.result as string);
                });

                newImages.push({
                    file: compressedFile,
                    preview: URL.createObjectURL(compressedFile),
                    base64: base64,
                    stats: { original: originalSize, compressed: compressedSize, saved: savedPercentage }
                });
            }

            setImages(prev => [...prev, ...newImages]);
            toast.success(`${newImages.length} image(s) added!`);

        } catch (error) {
            console.error("Compression Error:", error);
            toast.error("Failed to compress images");
        } finally {
            setIsCompressing(false);
            // Reset input
            event.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview); // Cleanup memory
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (formData: FormData) => {
        if (images.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        // We can manually append images to formData or rely on hidden inputs
        // It's cleaner to append manually to ensure array structure if using getAll
        // But hidden inputs work well with native FormData collection too.
        // Let's rely on hidden inputs named 'images' (plural) to get an array.

        // Wait... formData.get('images') will only get the first one if we have multiple inputs with same name?
        // Actually yes, formData.getAll('images') works if we have multiple inputs with name="images".

        const result = await createProduct(formData);

        if (result.success) {
            toast.success("Product Uploaded Successfully!");
            router.push("/admin/inventory");
        } else {
            toast.error(result.error || "Failed to upload product");
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8">
            {/* Hidden inputs for base64 images - This allows server to receive getAll('images') */}
            {images.map((img, idx) => (
                <input key={idx} type="hidden" name="images" value={img.base64} />
            ))}
            {/* Primary image fallback for backward compatibility logic (legacy imageUrl field) */}
            <input type="hidden" name="imageUrl" value={images[0]?.base64 || ""} />

            {/* Image Upload Area */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product Images ({images.length}/5)</label>
                    {images.length > 0 && (
                        <span className="text-xs text-slate-400 font-medium">First image will be the cover</span>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Upload Button */}
                    {images.length < 5 && (
                        <div className="relative group aspect-square">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={isCompressing}
                            />
                            <div className={`w-full h-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 transition-colors ${isCompressing ? 'opacity-50' : 'group-hover:bg-slate-100 group-hover:border-brand-blue/50'}`}>
                                {isCompressing ? (
                                    <Loader2 className="animate-spin text-brand-blue mb-2" size={24} />
                                ) : (
                                    <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-blue mb-2 group-hover:scale-110 transition-transform">
                                        <CloudUploadIcon />
                                    </div>
                                )}
                                <span className="text-xs font-bold text-slate-600">
                                    {isCompressing ? "Processing..." : "Add Images"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Previews */}
                    {images.map((img, index) => (
                        <div key={index} className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group/card animate-in fade-in zoom-in duration-300">
                            <img src={img.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                {index === 0 && (
                                    <span className="self-center px-2 py-1 bg-brand-blue/90 text-white text-[10px] font-bold rounded-full backdrop-blur-sm">
                                        Cover
                                    </span>
                                )}
                                {img.stats && (
                                    <div className="text-[9px] text-white/80 font-mono text-center bg-black/50 rounded-lg py-1 backdrop-blur-sm">
                                        {img.stats.compressed}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. iPhone 15 Pro Max Case"
                        className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Category</label>
                    <div className="relative">
                        <select name="category" aria-label="Product Category" className="w-full p-4 bg-slate-50 border-none rounded-[20px] font-bold text-slate-800 focus:ring-2 focus:ring-brand-blue/20 outline-none appearance-none cursor-pointer">
                            <option>General</option>
                            <option>Electronics & Gadgets</option>
                            <option>Fashion & Apparel</option>
                            <option>Beauty & Personal Care</option>
                            <option>Home & Living</option>
                            <option>Auto Parts & Accessories</option>
                            <option>Kids & Babies</option>
                            <option>bags & Shoes</option>
                            <option>Office & Stationery</option>
                            <option>Industrial & Tools</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>

            {/* Description - New */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe the product features, quality, and usage..."
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none"
                />
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Price</label>
                    <div className="relative flex gap-2">
                        <div className="relative w-1/3">
                            <select name="currency" className="w-full h-full p-4 bg-slate-50 border-none rounded-[20px] font-bold text-slate-800 focus:ring-2 focus:ring-brand-blue/20 outline-none appearance-none cursor-pointer text-center">
                                <option value="GHS">GHS</option>
                                <option value="RMB">RMB</option>
                            </select>
                        </div>
                        <input
                            name="priceValue"
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            className="w-2/3 p-4 bg-slate-50 border-none rounded-[20px] font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Stock Qty</label>
                    <input
                        name="stock"
                        type="number"
                        placeholder="10"
                        className="w-full p-4 bg-slate-50 border-none rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    />
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">MOQ</label>
                    <input
                        name="moq"
                        type="number"
                        placeholder="1"
                        defaultValue="1"
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
