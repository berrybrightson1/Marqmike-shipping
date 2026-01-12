"use client";

import StoreDirectory from "@/components/dashboard/StoreDirectory";
import StaffPicks from "@/components/dashboard/StaffPicks";

export default function ProductFeed() {
    return (
        <div className="pb-20 space-y-6">
            {/* 1. Store Directory (Links) */}
            <StoreDirectory />

            {/* 2. Staff Picks (Redesigned) */}
            <div className="mb-8">
                <StaffPicks />
            </div>
        </div>
    );
}
