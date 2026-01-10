import { getCurrentUser } from "@/app/actions/auth";
import SettingsView from "@/components/dashboard/settings/SettingsView";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return <SettingsView user={user} />;
}


