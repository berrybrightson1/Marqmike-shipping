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

    // Currency Logic
    const currency = formData.get("currency") as string || "GHS";
    const priceValue = parseFloat(formData.get("priceValue") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;

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
    const imageUrl = formData.get("imageUrl") as string || null;

    try {
        await prisma.product.create({
            data: {
                name,
                category,
                priceRMB,
                priceGHS,
                stock,
                imageUrl,
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
            take: 20 // Limit for homepage display
        });
        return { success: true, data: products };
    } catch (error) {
        console.error("Get Inventory Error:", error);
        return { success: false, data: [] };
    }
}
