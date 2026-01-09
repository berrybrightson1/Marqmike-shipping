import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Verify against environment variables
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (username === adminUsername && password === adminPassword) {
            // Create session cookie
            const response = NextResponse.json({ success: true });

            // Set HTTP-only cookie for admin session
            response.cookies.set({
                name: "admin-session",
                value: "authenticated",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/"
            });

            return response;
        }

        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}

export async function DELETE() {
    // Logout endpoint
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin-session");
    return response;
}
