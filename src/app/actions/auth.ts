"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";
import { logAuditAction } from "@/app/actions/audit";

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

// Send OTP (Mock for now)
export async function sendOTP(phone: string) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
        // In production, integration with SMS provider (e.g., Twilio/Arkesel) goes here.
        // For development, we'll log it or store it in DB to verify.

        // Store verification code in DB 
        // Note: You need a VerificationToken model or similar in Prisma
        // For this simplified version, let's assume we proceed or skip actual SMS sending
        console.log(`OTP for ${phone}: ${otp}`);

        return { success: true };
    } catch (error) {
        console.error("Send OTP Error:", error);
        return { success: false, error: "Failed to send OTP" };
    }
}

// Verify OTP (Mock)
export async function verifyOTP(phone: string, code: string) {
    // In a real app, verify against DB record
    // For now, accept default '123456' for testing
    if (code === '123456') {
        return { success: true };
    }
    return { success: false, error: "Invalid code" }; // Simplified
}

// Sign Up
export async function signUp(data: FormData) {
    const name = data.get('name') as string;
    const businessName = data.get('businessName') as string;
    const phone = data.get('phone') as string;
    // const otp = data.get('otp') as string; // Disabled OTP for now as per previous logic

    if (!phone) {
        return { success: false, error: "Phone number is required" };
    }

    try {
        // OTP Verification was skipped in previous code
        // const verification = await verifyOTP(phone, otp);
        // if (!verification.success) {
        //    return verification;
        // }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { phone }
        });

        if (existingUser) {
            return { success: false, error: "Account already exists. Please sign in." };
        }

        // Create new user
        const user = await db.user.create({
            data: {
                phone,
                name,
                businessName,
                role: "CUSTOMER"
            }
        });

        // Create session
        await createSession(user.id);

        await logAuditAction(
            "USER_SIGNUP",
            "USER",
            `New Customer: ${name || businessName || phone}`,
            user.id,
            { phone, businessName },
            name || "User"
        );

        return { success: true, userId: user.id, role: user.role };
    } catch (error) {
        console.error("Sign Up Error:", error);
        return { success: false, error: "Failed to create account" };
    }
}

// Sign in existing user (Direct Access - No OTP)
export async function signIn(phone: string) {
    try {
        // Direct access: skip OTP verification
        // const verification = await verifyOTP(phone, otp);
        // if (!verification.success) {
        //     return verification;
        // }

        // Find user
        const user = await db.user.findUnique({
            where: { phone }
        });

        if (!user) {
            return { success: false, error: "Account not found. Please sign up first." };
        }

        // Create session
        await createSession(user.id);

        await logAuditAction(
            "USER_LOGIN",
            "USER",
            `User Logged In: ${user.name || user.phone}`,
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

// Create session
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

        if (!sessionToken) return null;

        const session = await db.session.findUnique({
            where: { token: sessionToken },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            return null;
        }

        return session.user;
    } catch (error) {
        console.error("Get Current User Error:", error);
        return null;
    }
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
export async function updateProfile(data: { name?: string; businessName?: string; email?: string }) {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: user.id },
            data: {
                name: data.name,
                businessName: data.businessName,
                email: data.email
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
