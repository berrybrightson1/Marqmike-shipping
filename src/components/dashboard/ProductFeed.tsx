"use client";

import StaffPicks from "@/components/dashboard/StaffPicks";

export default function ProductFeed() {
    return (
        <div className="pb-20 space-y-6">
            {/* Staff Picks (Redesigned) */}
            <div className="mb-8">
                <StaffPicks />
            </div>
        </div>
    );
}
