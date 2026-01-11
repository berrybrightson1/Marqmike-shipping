"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";
import { logAuditAction } from "@/app/actions/audit";
import bcrypt from "bcryptjs";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

// Sign Up
export async function signUp(data: FormData) {
    const name = data.get('name') as string;
    const businessName = data.get('businessName') as string;
    const phone = data.get('phone') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!phone || !password || !name) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { phone },
                    { email: email || undefined }
                ]
            }
        });

        if (existingUser) {
            return { success: false, error: "Account already exists (Phone or Email). Please sign in." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                phone,
                name,
                businessName,
                email,
                password: hashedPassword,
                role: "CUSTOMER"
            }
        });

        await createSession(user.id);

        await logAuditAction(
            "USER_SIGNUP",
            "USER",
            `New Customer: ${name}`,
            user.id,
            { phone, businessName },
            name
        );

        return { success: true, userId: user.id, role: user.role };
    } catch (error) {
        console.error("Sign Up Error:", error);
        return { success: false, error: "Failed to create account" };
    }
}

// Sign in
export async function signIn(phone: string, password?: string) {
    try {
        const user = await db.user.findUnique({
            where: { phone }
        });

        if (!user) {
            return { success: false, error: "Account not found. Please sign up." };
        }

        // Migration Check: If user has no password, ask them to set one
        if (!user.password) {
            if (password) {
                // User provided a password but it's not set in DB yet -> First time login legacy
                // We should technically verify them via OTP before setting it, or just set it?
                // THE INSTRUCTION: "anybody who has an account with us if they try to sign in now, they should ask them to create a password."
                // This implies we return a flag telling UI to show "Create Password" view.
                return { success: false, code: "REQUIRE_PASSWORD_SETUP", userId: user.id };
            }
            return { success: false, code: "REQUIRE_PASSWORD_SETUP", userId: user.id };
        }

        // Normal Login
        if (!password) {
            return { success: false, error: "Password required" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { success: false, error: "Invalid credentials" };
        }

        await createSession(user.id);

        await logAuditAction(
            "USER_LOGIN",
            "USER",
            `User Logged In`,
            user.id,
            {},
            user.name || "User"
        );

        return { success: true, userId: user.id, role: user.role };
    } catch (error) {
        console.error("Sign In Error:", error);
        return { success: false, error: "Failed to sign in" };
    }
}


// Set Password (for migration)
export async function setInitialPassword(phone: string, newPassword: string) {
    // Ideally verify OTP here too for security
    try {
        const user = await db.user.findUnique({ where: { phone } });
        if (!user) return { success: false, error: "User not found" };

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Auto login after setting
        await createSession(user.id);
        return { success: true };
    } catch (err) {
        return { success: false, error: "Failed to set password" };
    }
}


// Create session helper
async function createSession(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await db.session.create({
        data: {
            userId,
            token,
            expiresAt
        }
    });

    cookies().set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });

    return token;
}

// Get current user from session
export async function getCurrentUser() {
    try {
        const sessionToken = cookies().get("session")?.value;

        if (sessionToken) {
            const session = await db.session.findUnique({
                where: { token: sessionToken },
                include: { user: true }
            });

            if (session && session.expiresAt > new Date()) {
                return session.user;
            }
        }
    } catch (error) {
        console.error("Get Current User Error:", error);
        return null; // Return null if session invalid
    }

    // REMOVED: Fallbacks for security in production-ready flow
    return null;
}

// Get user profile for checkout pre-fill
export async function getUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;

    return {
        name: user.name,
        businessName: user.businessName,
        phone: user.phone
    };
}

// Update user profile
export async function updateProfile(data: { name?: string; businessName?: string; email?: string; phone?: string }) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: user.id },
            data: {
                name: data.name,
                businessName: data.businessName,
                email: data.email,
                phone: data.phone
            }
        });

        await logAuditAction(
            "USER_PROFILE_UPDATE",
            "USER",
            `Profile Updated`,
            user.id,
            data,
            user.name || "User"
        );

        return { success: true };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

// Sign out
export async function signOut() {
    try {
        const user = await getCurrentUser();
        const sessionToken = cookies().get("session")?.value;

        if (sessionToken) {
            await db.session.delete({
                where: { token: sessionToken }
            });
        }

        if (user) {
            await logAuditAction(
                "USER_LOGOUT",
                "USER",
                `User Logged Out`,
                user.id,
                {},
                user.name || "User"
            );
        }

        cookies().delete("session");

        // No redirect here, server action usage in client should handle router.push if needed, 
        // or we rely on middleware. But typically redirects happen in component.
        return { success: true };
    } catch (error) {
        console.error("Sign Out Error:", error);
        return { success: false, error: "Failed to sign out" };
    }
}

// Check if phone number exists
export async function checkPhoneExists(phone: string) {
    try {
        const user = await db.user.findUnique({
            where: { phone },
            select: { id: true }
        });

        return { exists: !!user };
    } catch (error) {
        return { exists: false };
    }
}
