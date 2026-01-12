"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    // 1. Auth Check
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    // 2. Extract Data
    // 2. Extract Data
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    // Currency Logic
    const currency = formData.get("currency") as string || "GHS";
    const priceValue = parseFloat(formData.get("priceValue") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;
    const moq = parseInt(formData.get("moq") as string) || 1;

    let priceRMB = 0;
    let priceGHS = 0;

    // Mock Exchange Rate
    const EXCHANGE_RATE = 2.2; // 1 RMB = 2.2 GHS (Example)

    if (currency === "RMB") {
        priceRMB = priceValue;
        priceGHS = priceValue * EXCHANGE_RATE;
    } else {
        priceGHS = priceValue;
        priceRMB = priceValue / EXCHANGE_RATE;
    }

    // Image Handling
    // Get all images (from hidden inputs named "images")
    const images = formData.getAll("images") as string[];

    // Legacy support: 'imageUrl' input is also sent as single value of first image or null
    // But let's strictly use the first image of array if 'imageUrl' is not explicitly handled or if we prefer array source
    const imageUrl = images.length > 0 ? images[0] : null;

    try {
        await prisma.product.create({
            data: {
                name,
                category,
                description,
                priceRMB,
                priceGHS,
                stock,
                moq,
                imageUrl, // Primary cover
                images,   // Gallery array
                status: stock > 0 ? "In Stock" : "Out of Stock"
            }
        });

        revalidatePath("/admin/inventory");
        revalidatePath("/dashboard"); // Refresh user feed too
        return { success: true };
    } catch (error) {
        console.error("Create Product Error:", error);
        return { success: false, error: "Failed to create product" };
    }
}

export async function updateProduct(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "Product ID required" };

    // Handling inline updates or full updates
    // If only specific fields are present
    const data: any = {};

    // Check fields
    if (formData.has("stock")) data.stock = parseInt(formData.get("stock") as string);
    if (formData.has("status")) data.status = formData.get("status") as string;

    // Recalculate status if stock changed to 0?
    if (data.stock !== undefined && data.stock === 0) data.status = "Out of Stock";
    if (data.stock !== undefined && data.stock > 0 && !data.status) data.status = "In Stock";

    try {
        await prisma.product.update({
            where: { id },
            data
        });
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error) {
        console.error("Update Product Error:", error);
        return { success: false, error: "Failed to update" };
    }
}

export async function deleteProduct(id: string) {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath("/admin/inventory");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete" };
    }
}

export async function getInventory() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20, // Limit for homepage display
            select: {
                id: true,
                name: true,
                category: true,
                priceRMB: true,
                priceGHS: true,
                stock: true,
                moq: true,
                imageUrl: true, // Only cover image
                status: true,
                createdAt: true,
            }
        });
        return { success: true, data: products };
    } catch (error) {
        console.error("Get Inventory Error:", error);
        return { success: false, data: [] };
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });
        return { success: true, data: product };
    } catch (error) {
        console.error("Get Product Error:", error);
        return { success: false, error: "Failed to fetch product" };
    }
}
