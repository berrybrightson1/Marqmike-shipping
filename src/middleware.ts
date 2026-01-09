import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public Routes: Home, Store & Products, Tracking, Help, Webhooks
const isPublicRoute = createRouteMatcher([
    '/',
    '/store(.*)',
    '/track(.*)',
    '/help(.*)',
    '/api/upload(.*)',
    '/login(.*)', // Auth pages must be public
    '/sign-up(.*)'
]);

// Protected Routes: Admin, Profile, Services
const isProtectedRoute = createRouteMatcher([
    '/admin(.*)',
    '/profile(.*)',
    '/services/buy-for-me(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
    // If it's a protected route and user is not logged in, redirect to sign-in
    if (isProtectedRoute(req)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) {
            return redirectToSignIn();
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
