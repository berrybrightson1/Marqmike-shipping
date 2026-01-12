
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Verification Flow...");
    console.log("DB URL exists:", !!process.env.DATABASE_URL);
    // console.log("DB URL:", process.env.DATABASE_URL); // Debug only if safe


    // 1. Create Dummy User
    let user;
    try {
        user = await prisma.user.upsert({
            where: { phone: "+999999999" },
            update: {},
            create: {
                phone: "+999999999",
                name: "Test User",
                password: "password123",
                role: "CUSTOMER"
            }
        });
    } catch (error) {
        console.error("❌ DB Connection Failed:", JSON.stringify(error, null, 2));
        // Also print standard error to see stack if needed
        console.error(error);
        return;
    }

    console.log(`✅ User Ready: ${user.id}`);

    // 2. Create Dummy Order (Pending)
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            totalAmount: 100,
            status: "Pending",
            refCode: "TEST-ORD-1",
            customerName: user.name || "Test",
            customerPhone: user.phone,
            items: {
                create: {
                    itemName: "Test Widget",
                    quantity: 1,
                    priceAtTime: 100
                }
            }
        }
    });

    console.log(`✅ Order Created: ${order.id} [${order.status}]`);

    // 3. Admin Updates to "Arrived" (Virtual Warehouse)
    // Logic from updateUnifiedStatus
    await prisma.order.update({
        where: { id: order.id },
        data: { status: "Arrived" }
    });

    console.log(`✅ Order Updated to 'Arrived'`);

    // 4. Verify User sees it in Warehouse Tab
    // Logic from getUserOrders
    const warehouseCheck = await prisma.order.findFirst({
        where: { userId: user.id, id: order.id, shipmentId: null },
    });

    if (warehouseCheck && warehouseCheck.status === 'Arrived') {
        console.log(`✅ Verified: Order is in 'Warehouse' state (Arrived, no ShipmentId)`);
    } else {
        console.error(`❌ Validation Failed: Order not found in correct warehouse state`);
    }

    // 5. Consolidate (Create Shipment)
    // Logic from createConsolidatedShipment
    const trackingId = `TEST-TRK-${Math.floor(Math.random() * 1000)}`;
    const shipment = await prisma.shipment.create({
        data: {
            trackingId,
            customerId: user.id,
            status: "Processing",
            shipperName: "Consolidated Test",
            recipientName: user.name || "Customer",
            origin: "CN",
            destination: "GH",
            orders: {
                connect: { id: order.id }
            }
        },
        include: { orders: true }
    });

    // Manually update order status to Shipped as per action logic
    await prisma.order.update({
        where: { id: order.id },
        data: { status: "Shipped" } // Action sets this to Shipped
    });

    console.log(`✅ Shipment Created: ${shipment.trackingId} with Order ${shipment.orders[0].id}`);

    // 6. Verify Final State
    const finalOrder = await prisma.order.findUnique({ where: { id: order.id } });
    if (finalOrder?.shipmentId === shipment.id && finalOrder?.status === "Shipped") {
        console.log(`✅ Flow Complete: Order linked to Shipment and status is Shipped.`);
    } else {
        console.error(`❌ Final State Invalid`);
    }

    // cleanup
    await prisma.order.deleteMany({ where: { userId: user.id } });
    await prisma.shipment.deleteMany({ where: { customerId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log("🧹 Cleanup Done");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
