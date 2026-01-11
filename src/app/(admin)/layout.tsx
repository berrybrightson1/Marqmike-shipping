import AdminSidebar from "@/components/admin/AdminSidebar";
import GlobalSearchModal from "@/components/admin/GlobalSearchModal";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#F2F6FC] flex">
            <AdminSidebar />
            <main className="flex-1 md:ml-72 min-h-screen w-full">
                {children}
            </main>
            <GlobalSearchModal />
        </div>
    );
}
