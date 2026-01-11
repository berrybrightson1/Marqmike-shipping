"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode; // Optional content to show if not authenticated (instead of children)
    onGuestAction?: () => void; // Optional custom action when guest clicks
    mode?: "redirect" | "modal"; // For now we just implement redirect
}

/**
 * Wraps interactive elements that require login.
 * If user is Guest: Intercepts click, saves intent, redirects to login.
 */
export default function AuthGuard({ children, fallback, onGuestAction }: AuthGuardProps) {
    const { isSignedIn, loading } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const handleAction = (e: React.MouseEvent) => {
        if (loading) return;

        if (!isSignedIn) {
            e.preventDefault();
            e.stopPropagation();

            toast.info("Please sign in to continue", {
                description: "We'll bring you right back here!",
            });

            if (onGuestAction) {
                onGuestAction();
            } else {
                // Default: Redirect to login with return URL
                const returnUrl = encodeURIComponent(pathname);
                router.push(`/login?redirect_url=${returnUrl}`);
            }
            return;
        }

        // If signed in, let the click propagate to the child
    };

    // If we have a fallback and user is not signed in, show fallback (mostly for whole page protection)
    // But for "Buttons", we usually just wrap the button div.

    return (
        <div onClickCapture={handleAction} className="inline-block">
            {children}
        </div>
    );
}
