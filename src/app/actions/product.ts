"use server";

import { db as prisma } from "@/lib/db";
import { getCurrentUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
    // 1. Auth Check
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
        return { success: false, error: "Unauthorized" };
    }

    // 2. Extract Data
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const priceRMB = parseFloat(formData.get("priceRMB") as string);
    const stock = parseInt(formData.get("stock") as string) || 0;

    const rate = 2.2; // Mock Rate
    const priceGHS = priceRMB * rate;

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
