import AdminSidebar from "@/components/admin/AdminSidebar";
import GlobalSearchModal from "@/components/admin/GlobalSearchModal";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
