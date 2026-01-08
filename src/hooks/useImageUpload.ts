import { useState } from 'react';
import imageCompression from 'browser-image-compression';

interface UseImageUploadResult {
    compressImage: (file: File) => Promise<File>;
    uploadImage: (file: File) => Promise<string>;
    isCompressing: boolean;
    isUploading: boolean;
    error: string | null;
}

export function useImageUpload(): UseImageUploadResult {
    const [isCompressing, setIsCompressing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const compressImage = async (file: File): Promise<File> => {
        setIsCompressing(true);
        setError(null);

        const options = {
            maxSizeMB: 0.1, // 100KB limit
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp' // Convert to WebP
        };

        try {
            const compressedFile = await imageCompression(file, options);
            setIsCompressing(false);
            return compressedFile;
        } catch (err) {
            setIsCompressing(false);
            setError("Failed to compress image.");
            throw err;
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        setIsUploading(true);
        setError(null);

        try {
            // Placeholder for actual internal API upload or Vercel Blob upload
            // In a real implementation, you would FormData append the file and POST to an API route

            // For now, we'll simulate an upload and return a fake URL or base64 for preview
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Just returning a local object URL for demonstration as we don't have Vercel Blob configured yet
            const objectUrl = URL.createObjectURL(file);

            setIsUploading(false);
            return objectUrl;
        } catch (err) {
            setIsUploading(false);
            setError("Failed to upload image.");
            throw err;
        }
    };

    return { compressImage, uploadImage, isCompressing, isUploading, error };
}
