import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("🔍 Checking Users in DB...");
    const users = await db.user.findMany();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => {
        console.log(`- User: ${u.name}, Phone: ${u.phone}, Role: ${u.role}, PasswordSet: ${!!u.password}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
