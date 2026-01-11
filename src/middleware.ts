import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
    const sessionToken = req.cookies.get("session")?.value;
    const pathname = req.nextUrl.pathname;

    // Public routes (no auth required)
    const publicRoutes = ["/", "/track", "/help", "/login", "/signup", "/api/upload"];
    const isPublic = publicRoutes.some(route => pathname.startsWith(route));

    if (isPublic) {
        return NextResponse.next();
    }

    // Check if user has valid session cookie
    // if (!sessionToken) {
    //     return NextResponse.redirect(new URL("/auth/login", req.url));
    // }

    // Role-based protection:
    // Ideally we verify role here, but DB access in middleware is unstable.
    // We will rely on the Layout/Page server components to validate the session and role.
    // However, we can do a naive check if we encoded role in a non-httpOnly cookie, 
    // but for now, let's just allow it and let Layout handle the security.

    // For specific admin redirection loop prevention (optional but good):
    // If we are on /admin and we are NOT an admin, Layout will redirect to /auth/admin-login.
    // This is fine.

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
