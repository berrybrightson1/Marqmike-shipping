"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/app/actions/auth";

export default function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully");
            window.location.href = "/login";
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors px-4 py-2 rounded-xl"
        >
            <LogOut size={16} />
            Logout
        </button>
    );
}
