"use client";

import TrendingFeed from "@/components/dashboard/TrendingFeed";
import StaffPicks from "@/components/dashboard/StaffPicks";

export default function ProductFeed() {
    return (
        <div className="pb-20 space-y-8">
            {/* 1. Live Trending Feed (1688 Data) */}
            <TrendingFeed />

            {/* 2. Staff Picks (Internal Inventory) */}
            <div className="mb-8">
                <StaffPicks />
            </div>
        </div>
    );
}
