"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "./auth";
import { revalidatePath } from "next/cache";

// --- User Actions ---

export async function createTicket(data: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const subject = data.get("subject") as string;
    const message = data.get("message") as string;
    const priority = (data.get("priority") as string) || "MEDIUM";

    if (!message) return { error: "Message is required" };

    try {
        const ticket = await db.ticket.create({
            data: {
                userId: user.id,
                subject: subject || "No Subject",
                priority,
                status: "OPEN",
                messages: {
                    create: {
                        sender: "USER",
                        message
                    }
                }
            }
        });

        revalidatePath("/dashboard/support");
        return { success: true, ticketId: ticket.id };
    } catch (error) {
        console.error("Create Ticket Error:", error);
        return { error: "Failed to create ticket" };
    }
}

export async function getUserTickets() {
    const user = await getCurrentUser();
    if (!user) return { data: [] };

    try {
        const tickets = await db.ticket.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
            include: { messages: { orderBy: { createdAt: "asc" } } }
        });
        return { success: true, data: tickets };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function addReply(ticketId: string, message: string, sender: "USER" | "ADMIN") {
    try {
        await db.ticketMessage.create({
            data: {
                ticketId,
                sender,
                message
            }
        });

        await db.ticket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date(), status: sender === 'ADMIN' ? 'IN_PROGRESS' : 'OPEN' } // Re-open or update status based on reply
        });

        revalidatePath(`/dashboard/support`);
        revalidatePath(`/admin/support`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to send message" };
    }
}

// --- Admin Actions ---

export async function getAllTickets() {
    try {
        const tickets = await db.ticket.findMany({
            orderBy: { updatedAt: "desc" },
            include: {
                user: { select: { name: true, phone: true } },
                messages: { orderBy: { createdAt: "asc" } }
            }
        });
        return { success: true, data: tickets };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function updateTicketStatus(ticketId: string, status: string) {
    try {
        await db.ticket.update({
            where: { id: ticketId },
            data: { status }
        });
        revalidatePath("/admin/support");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}
