import { NextResponse } from "next/server";
import { createOrder, getPendingOrderCount } from "@/app/actions/orders";

export async function GET() {
    console.log("--- STARTING TEST ---");

    // 1. Get initial count
    const initial = await getPendingOrderCount();
    console.log("Initial Count:", initial.count);

    // 2. Simulate Checkout
    console.log("Simulating Checkout...");
    const orderRes = await createOrder({
        customerName: "Test Robot",
        customerPhone: "+0000000000",
        items: [{ itemName: "Test Item", quantity: 1, priceAtTime: 100 }]
    });

    if (!orderRes.success) {
        return NextResponse.json({ error: "Failed to create order", details: orderRes.error }, { status: 500 });
    }

    // 3. Get new count
    const final = await getPendingOrderCount();
    console.log("Final Count:", final.count);

    return NextResponse.json({
        success: true,
        initialCount: initial.count,
        finalCount: final.count,
        orderRef: orderRes.refCode,
        difference: (final.count || 0) - (initial.count || 0) // Should be 1
    });
}
