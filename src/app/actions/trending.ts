"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrendingItems() {
    try {
        const items = await db.trendingItem.findMany({
            orderBy: { priority: 'desc' }
        });
        return { success: true, data: items };
    } catch (error) {
        console.error("Get Trending Items Error:", error);
        return { success: false, data: [] };
    }
}

export async function addTrendingItem(data: {
    title: string;
    image: string;
    price: number;
    url: string;
    moq?: number;
    currency?: string;
}) {
    try {
        await db.trendingItem.create({
            data: {
                ...data,
                moq: data.moq || 1,
                currency: data.currency || "CNY",
                priority: 0 // Default priority
            }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Add Trending Item Error:", error);
        return { success: false, error: "Failed to add item" };
    }
}

export async function deleteTrendingItem(id: string) {
    try {
        await db.trendingItem.delete({
            where: { id }
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Delete Trending Item Error:", error);
        return { success: false, error: "Failed to delete item" };
    }
}
