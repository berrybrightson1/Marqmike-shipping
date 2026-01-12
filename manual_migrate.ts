import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting manual migration...');

    try {
        // 1. Add shipmentId to Order
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "Order" 
      ADD COLUMN IF NOT EXISTS "shipmentId" TEXT;
    `);
        console.log('Added shipmentId to Order');

        // 2. Add FK to Order
        // Note: Checking explicitly if constraint exists is hard in raw SQL cross-db, 
        // but IF NOT EXISTS works for columns. For constraints, we might error if duplicate.
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "Order"
        ADD CONSTRAINT "Order_shipmentId_fkey" 
        FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        `);
            console.log('Added FK to Order');
        } catch (e) {
            console.log('FK Order might already exist or failed:', e);
        }

        // 3. Add Index to Order
        try {
            await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Order_shipmentId_idx" ON "Order"("shipmentId");`);
        } catch (e) { }


        // 4. Add shipmentId to ProcurementRequest
        await prisma.$executeRawUnsafe(`
      ALTER TABLE "ProcurementRequest" 
      ADD COLUMN IF NOT EXISTS "shipmentId" TEXT;
    `);
        console.log('Added shipmentId to ProcurementRequest');

        // 5. Add FK to ProcurementRequest
        try {
            await prisma.$executeRawUnsafe(`
        ALTER TABLE "ProcurementRequest"
        ADD CONSTRAINT "ProcurementRequest_shipmentId_fkey" 
        FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        `);
            console.log('Added FK to ProcurementRequest');
        } catch (e) {
            console.log('FK Procurement might already exist:', e);
        }

        // 6. Add Index to ProcurementRequest
        try {
            await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ProcurementRequest_shipmentId_idx" ON "ProcurementRequest"("shipmentId");`);
        } catch (e) { }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
