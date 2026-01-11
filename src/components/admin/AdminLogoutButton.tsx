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
            router.push("/login"); // Or admin/login if separate
            router.refresh();
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
        >
            <LogOut size={16} />
            Logout
        </button>
    );
}
