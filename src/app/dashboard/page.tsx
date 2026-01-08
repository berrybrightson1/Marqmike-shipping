import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ActionGrid from "@/components/dashboard/ActionGrid";
import ShipmentCard from "@/components/dashboard/ShipmentCard";
import ProductFeed from "@/components/dashboard/ProductFeed";
import { getDashboardData } from "@/app/actions/shipment";

export default async function DashboardPage() {
    const { shipments } = await getDashboardData();

    return (
        <>
            <DashboardHeader />

            <div className="px-6 -mt-16 relative z-10 space-y-6">

                {/* Action Grid (Floating) */}
                {/* Action Grid (Floating) */}
                <div className="mx-2">
                    <ActionGrid />
                </div>

                {/* Product Feed */}
                <ProductFeed />


            </div>
        </>
    );
}
