import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("🧹 Starting Database Cleanup...");

    // Delete in order of dependencies (Child -> Parent)

    // 1. Transactional/Related Data
    await db.notification.deleteMany({});
    console.log("Deleted Notifications");

    await db.session.deleteMany({});
    console.log("Deleted Sessions");

    await db.procurementRequest.deleteMany({});
    console.log("Deleted Procurement Requests");

    await db.shipmentEvent.deleteMany({}); // Child of Shipment
    console.log("Deleted Shipment Events");

    await db.shipment.deleteMany({});
    console.log("Deleted Shipments");

    await db.orderItem.deleteMany({}); // Child of Order
    console.log("Deleted Order Items");

    await db.order.deleteMany({});
    console.log("Deleted Orders");

    await db.ticketMessage.deleteMany({});
    await db.ticket.deleteMany({});
    console.log("Deleted Tickets");

    await db.oTPCode.deleteMany({});
    console.log("Deleted OTP Codes");

    await db.auditLog.deleteMany({});
    console.log("Deleted Audit Logs");

    // 2. Users (Parents)
    await db.user.deleteMany({});
    console.log("Deleted Users");

    console.log("✅ Database cleared successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
