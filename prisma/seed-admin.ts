import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    const adminPhone = "admin";

    const existingAdmin = await db.user.findUnique({
        where: { phone: adminPhone },
    });

    if (existingAdmin) {
        console.log("Admin user already exists.");
        // Ensure role is ADMIN
        if (existingAdmin.role !== "ADMIN") {
            await db.user.update({
                where: { id: existingAdmin.id },
                data: { role: "ADMIN" }
            });
            console.log("Updated existing user to ADMIN role.");
        }
    } else {
        await db.user.create({
            data: {
                phone: adminPhone,
                name: "System Admin",
                role: "ADMIN",
            },
        });
        console.log("Admin user created successfully.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
