import BottomNav from "@/components/layout/BottomNav";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-slate-100 flex justify-center items-start">
            {/* Mobile Shell Global Wrapper */}
            <div className="w-full max-w-md bg-[#F2F6FC] min-h-screen shadow-2xl relative overflow-hidden">
                {/* Content Area - pushed up by bottom nav padding handled in components or global padding here */}
                <div className="pb-24">
                    {children}
                </div>

                {/* Fixed Bottom Nav */}
                <BottomNav />
            </div>
        </div>
    );
}
