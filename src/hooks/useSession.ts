"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/auth";

export function useSession() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser();
                setUser(user);
            } catch (e) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    return { user, loading, isSignedIn: !!user };
}
