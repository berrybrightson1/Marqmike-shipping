
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // --- Seed Inventory (Products) ---
    console.log('📦 Seeding Inventory...')

    // Clear existing products to avoid duplicates if re-running (optional, or use upsert)
    // await prisma.product.deleteMany({}) 

    const products = [
        {
            name: "Transparent iPhone 15 Case",
            description: "Crystal clear case with anti-yellowing technology.",
            priceRMB: 12,
            priceGHS: 28,
            stock: 500,
            status: "Ready in Ghana",
            imageUrl: "https://placehold.co/400x400/png?text=Case"
        },
        {
            name: "Smart Watch Ultra 2",
            description: "Latest clone with AMOLED screen.",
            priceRMB: 145,
            priceGHS: 350,
            stock: 50,
            status: "In China Warehouse",
            imageUrl: "https://placehold.co/400x400/png?text=Watch"
        },
        {
            name: "Wireless Earbuds Pro",
            description: "Active noise cancellation.",
            priceRMB: 45,
            priceGHS: 110,
            stock: 200,
            status: "Ready in Ghana",
            imageUrl: "https://placehold.co/400x400/png?text=Buds"
        },
        {
            name: "Portable Mini Fan",
            description: "Rechargeable 5000mAh battery.",
            priceRMB: 18,
            priceGHS: 45,
            stock: 1000,
            status: "In China Warehouse",
            imageUrl: "https://placehold.co/400x400/png?text=Fan"
        },
        {
            name: "Laptop Stand Aluminum",
            description: "Ergonomic foldable stand.",
            priceRMB: 55,
            priceGHS: 135,
            stock: 150,
            status: "Ready in Ghana",
            imageUrl: "https://placehold.co/400x400/png?text=Stand"
        },
        {
            name: "Led Ring Light 10\"",
            description: "Dimmable light for streaming.",
            priceRMB: 35,
            priceGHS: 85,
            stock: 80,
            status: "In China Warehouse",
            imageUrl: "https://placehold.co/400x400/png?text=Light"
        },
        {
            name: "Mechanical Keyboard",
            description: "RGB Backlit Blue Switches",
            priceRMB: 120,
            priceGHS: 280,
            stock: 45,
            status: "In China Warehouse",
            imageUrl: "https://placehold.co/400x400/png?text=Keyboard"
        },
        {
            name: "Gaming Mouse",
            description: "High DPI wired mouse",
            priceRMB: 45,
            priceGHS: 100,
            stock: 120,
            status: "Ready in Ghana",
            imageUrl: "https://placehold.co/400x400/png?text=Mouse"
        }
    ]

    for (const p of products) {
        // Upsert to prevent duplicate errors
        await prisma.product.upsert({
            where: { id: p.name.toLowerCase().replace(/\s/g, '-') }, // Generate a pseudo-ID or just use create if confident
            update: {},
            create: {
                // Since we can't easily rely on a deterministic ID without setting it manually, 
                // and `id` is a CUID, let's just create if we want valid CUIDs.
                // But to avoid duplicates on re-run, we might check first.
                ...p
            }
        }).catch(async () => {
            // Fallback: If upsert fails on ID (which we mocked), just create.
            // Actually, let's findFirst.
            const existing = await prisma.product.findFirst({ where: { name: p.name } })
            if (!existing) {
                await prisma.product.create({ data: p })
            }
        })
    }


    // --- Seed Procurement (Pending Requests) ---
    console.log('📝 Seeding Procurement Requests...')

    // We need a user to attach these to. Let's find the first user or create a generic one.
    let demoUser = await prisma.user.findFirst({ where: { email: "demo@marqmike.com" } })
    if (!demoUser) {
        // Try to find ANY user
        demoUser = await prisma.user.findFirst()
    }

    if (demoUser) {
        const requests = [
            { itemName: "50x iPhone Screens", itemUrl: "https://1688.com/item/123", status: "Pending", notes: "Please check quality." },
            { itemName: "Industrial Sewing Machine", itemUrl: "https://alibaba.com/item/555", status: "In Review", notes: "Need shipping quote." },
            { itemName: "Custom Branding Bags", itemUrl: "https://taobao.com/item/888", status: "Pending", notes: "Logo attached separately." },
        ]

        for (const r of requests) {
            await prisma.procurementRequest.create({
                data: {
                    userId: demoUser.id,
                    ...r
                }
            })
        }
    } else {
        console.log("⚠️ No user found to attach procurement requests to. Skipping procurement seed.")
    }

    console.log('✅ Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
