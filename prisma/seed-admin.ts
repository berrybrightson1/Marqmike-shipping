import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
    // The "Backdoor" Admin
    const adminPhone = "admin";

    // Hash the password "admin"
    const hashedPassword = await bcrypt.hash("admin", 10);

    const existingAdmin = await db.user.findUnique({
        where: { phone: adminPhone },
    });

    if (existingAdmin) {
        console.log("Admin user already exists. Updating credentials...");
        await db.user.update({
            where: { id: existingAdmin.id },
            data: {
                role: "ADMIN",
                password: hashedPassword, // Ensure password is set/reset
                name: "Super Admin"
            }
        });
        console.log("Updated existing admin user.");
    } else {
        await db.user.create({
            data: {
                phone: adminPhone,
                name: "Super Admin",
                role: "ADMIN",
                password: hashedPassword,
                email: "admin@marqmike.com",
                businessName: "Marqmike HQ"
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
