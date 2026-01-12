import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActionGrid from "@/components/dashboard/ActionGrid";
import ShipmentCard from "@/components/dashboard/ShipmentCard";
import ProductFeed from "@/components/dashboard/ProductFeed";
import { getDashboardData } from "@/app/actions/shipment";
import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import StoreSlider from "@/components/dashboard/StoreSlider";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const { shipments } = await getDashboardData();

    return (
        <>
            <DashboardHeader user={user} />

            <div className="px-6 -mt-16 relative z-10 space-y-6">

                {/* Action Grid */}
                <div className="mx-2">
                    <ActionGrid />
                </div>

                {/* Featured Stores */}
                <StoreSlider />

                {/* Product Feed */}
                <ProductFeed />


            </div>
        </>
    );
}
