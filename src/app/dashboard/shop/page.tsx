import { getCurrentUser } from "@/app/actions/auth";
import ShoppingView from "@/components/dashboard/shop/ShoppingView";

export default async function ShoppingPage() {
    const user = await getCurrentUser();
    return <ShoppingView user={user} />;
}
