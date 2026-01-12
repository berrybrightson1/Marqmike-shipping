import { toast } from "sonner";

export type NotificationType = "EMAIL" | "SMS" | "PUSH";

interface NotificationPayload {
    to: string;
    subject?: string;
    body: string;
}

export const sendNotification = async (type: NotificationType, payload: NotificationPayload) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));



    if (type === "EMAIL") {
        toast.success(`Email sent to ${payload.to}`, {
            description: payload.subject,
            icon: "📧"
        });
    } else if (type === "SMS") {
        toast.success(`SMS sent to ${payload.to}`, {
            description: "Message delivered",
            icon: "📱"
        });
    }

    return { success: true, timestamp: new Date().toISOString() };
};

export const notifyShipmentUpdate = async (trackingId: string, status: string, customerPhone: string, customerEmail: string) => {
    // Send SMS
    await sendNotification("SMS", {
        to: customerPhone,
        body: `Your shipment ${trackingId} is now ${status}. Track it on Marqmike app.`
    });

    // Send Email
    await sendNotification("EMAIL", {
        to: customerEmail,
        subject: `Shipment Update: ${trackingId}`,
        body: `Dear Customer, your shipment ${trackingId} status has been updated to ${status}.`
    });
};
