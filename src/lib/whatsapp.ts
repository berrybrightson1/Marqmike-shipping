import { db } from "@/lib/db";

const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";

export async function sendWhatsAppMessage(to: string, message: string) {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
        console.error("WhatsApp credentials missing in .env");
        return { success: false, error: "System configuration error" };
    }

    try {
        // Remove '+' and spaces from phone number for API
        const formattedPhone = to.replace(/[^0-9]/g, "");

        const response = await fetch(`${WHATSAPP_API_URL}/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedPhone,
                type: "text",
                text: {
                    preview_url: false,
                    body: message
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("WhatsApp API Error Response:", data);
            return {
                success: false,
                error: data.error?.message || "Failed to send WhatsApp message"
            };
        }

        return { success: true, messageId: data.messages?.[0]?.id };

    } catch (error) {
        console.error("WhatsApp Send Error:", error);
        return { success: false, error: "Network error sending WhatsApp message" };
    }
}
