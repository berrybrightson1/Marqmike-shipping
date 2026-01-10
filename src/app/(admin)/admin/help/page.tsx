"use client";

import { BookOpen, Search, ArrowRight, Box, CreditCard, Users, HelpCircle, Package, Bell, Download, Shield, Tag, ChartBar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminHelpPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const guides = [
        {
            title: "Handling Procurement Requests",
            desc: "Step-by-step guide on processing 'Buy For Me' requests from customers.",
            icon: Box,
            steps: [
                "Navigate to **Inventory > Procurement** in the sidebar.",
                "Review the 'Pending' requests list - shows customer name, product link, quantity.",
                "Click on a request to view full item details and customer message.",
                "Verify the product is available and calculate the total cost (item + shipping + fees).",
                "If approved, click **'Approve & Quote'** and enter the accurate total cost in USD.",
                "The customer will be instantly notified via system notification to make payment.",
                "Once customer pays, status automatically moves to 'Paid'.",
                "Proceed to purchase the item using the provided link and details.",
                "After purchase, upload receipt/proof and mark as 'Processing'.",
                "When item arrives at warehouse, create a shipment for the customer."
            ],
            link: "/admin/procurement"
        },
        {
            title: "Creating a New Shipment",
            desc: "How to log a new package received at the warehouse and assign to customer.",
            icon: Box,
            steps: [
                "Go to **Shipments** in the sidebar.",
                "Click **'Create New Shipment'** or the floating '+' button.",
                "Enter the **Tracking ID** (use customer's original tracking or generate new).",
                "Search and select the **Customer** by name, email, or phone number.",
                "Enter package **weight** in KG (be accurate for pricing).",
                "Enter **dimensions** (Length × Width × Height in CM).",
                "Upload a **photo** of the package (optional but recommended).",
                "Set initial status to **'Received at Origin'**.",
                "Add any **special notes** (fragile, perishable, urgent, etc.).",
                "Click **Save** - Customer receives instant notification with tracking link."
            ],
            link: "/admin/shipments"
        },
        {
            title: "Updating Shipment Status",
            desc: "How to update package status as it moves through the delivery pipeline.",
            icon: Package,
            steps: [
                "Go to **Shipments** and find the package (use search or filters).",
                "Click on the shipment to open full details.",
                "Locate the **Status** dropdown at the top of the detail view.",
                "Select new status: **In Transit**, **Customs Clearance**, **Out for Delivery**, **Delivered**.",
                "Add a **status note** if needed (e.g., 'Held at customs - needs clearance docs').",
                "Click **Update Status** - Customer is instantly notified of the change.",
                "For **Delivered** status, optionally upload proof of delivery photo.",
                "Status history is automatically logged in the Audit Logs."
            ],
            link: "/admin/shipments"
        },
        {
            title: "Managing Customer Accounts",
            desc: "How to view, edit, block, or unblock customer accounts.",
            icon: Users,
            steps: [
                "Navigate to **Customers** in the sidebar.",
                "Use the **search bar** to find a specific customer by name, email, or phone.",
                "Click on a customer to view their **full profile** and activity history.",
                "To **edit details**, click the edit icon and update name, phone, or address.",
                "To **block a customer**, scroll down and click **'Block Account'** button.",
                "Blocked customers cannot log in or place new orders.",
                "To **unblock**, visit the same profile and click **'Unblock Account'**.",
                "All customer actions are logged in the **Audit Logs** automatically."
            ],
            link: "/admin/customers"
        },
        {
            title: "Handling Support Tickets",
            desc: "Responding to customer inquiries and resolving support tickets.",
            icon: HelpCircle,
            steps: [
                "Go to **Support Desk** in the sidebar.",
                "View all **Open** and **In Progress** tickets in the left panel.",
                "Use **search** or **filter by status** to find specific tickets.",
                "Click on a ticket to view the full conversation history.",
                "Read the customer's message and any previous replies.",
                "Type your response in the **Reply** box at the bottom.",
                "Click **Send Reply** - Customer is notified immediately.",
                "Status auto-updates to **'In Progress'** when you reply.",
                "Once resolved, change status to **'Closed'** using the dropdown.",
                "Closed tickets can be reopened if customer replies again."
            ],
            link: "/admin/support"
        },
        {
            title: "Broadcasting System Messages",
            desc: "Sending important announcements or alerts to all platform users.",
            icon: Bell,
            steps: [
                "Navigate to **Settings** in the sidebar.",
                "Scroll down to **'Communication & Alerts'** section.",
                "Enter a clear **Notification Title** (e.g., 'System Maintenance Alert').",
                "Write your **message body** with all necessary details.",
                "Review the message carefully - this goes to ALL users.",
                "Click **'Broadcast to All Users'** button.",
                "Confirm the action in the popup dialog.",
                "All users receive the notification instantly in their dashboard.",
                "Broadcast is logged in Audit Logs with timestamp and admin name."
            ],
            link: "/admin/settings"
        },
        {
            title: "Exporting Data (Orders & Shipments)",
            desc: "How to generate CSV reports for orders and shipments data.",
            icon: Download,
            steps: [
                "Go to **Settings** page.",
                "Locate the **'Data Management'** section.",
                "Click **'Export Orders CSV'** to download all order records.",
                "Or click **'Export Shipments CSV'** for shipment data.",
                "File downloads automatically to your device.",
                "CSV includes all key fields: IDs, customer info, dates, status, amounts.",
                "Open with Excel, Google Sheets, or any CSV viewer.",
                "Use for accounting, reporting, or backup purposes."
            ],
            link: "/admin/settings"
        },
        {
            title: "Viewing Audit Logs",
            desc: "Tracking all system activities and user actions for security and compliance.",
            icon: Shield,
            steps: [
                "Navigate to **Audit Logs** in the sidebar.",
                "View chronological list of all platform activities.",
                "Each log shows: **User**, **Action**, **Timestamp**, **Details**.",
                "Use **search** to find specific events (e.g., 'login', 'status update').",
                "Filter by **date range** using the date picker.",
                "Filter by **action type** (Login, Logout, Create, Update, Delete).",
                "Click **'Load More'** to paginate through older logs.",
                "Logs are permanent and cannot be edited or deleted.",
                "Critical for security audits and compliance tracking."
            ],
            link: "/admin/audit"
        },
        {
            title: "Managing Trending Products",
            desc: "How to add, edit, or remove items from the trending feed displayed to customers.",
            icon: Tag,
            steps: [
                "Go to **Inventory > Trending** in the sidebar.",
                "View current trending items displayed to customers.",
                "To **add new item**, click **'Add Trending Item'** button.",
                "Enter product **name**, **image URL**, and **source link**.",
                "Set **order/priority** to control display position.",
                "Click **Save** - Item appears immediately in customer trending feed.",
                "To **edit**, click the edit icon on any item.",
                "To **remove**, click the delete/trash icon.",
                "Keep 5-10 trending items for best customer engagement."
            ],
            link: "/admin/inventory/trending"
        },
        {
            title: "Understanding the Analytics Dashboard",
            desc: "How to read and interpret the admin dashboard charts and metrics.",
            icon: ChartBar,
            steps: [
                "Open the **Admin Dashboard** (home page after login).",
                "View **Total Revenue** card showing all-time earnings.",
                "Check **Active Shipments** count for packages currently in transit.",
                "Monitor **Total Customers** to track user growth.",
                "Review the **Revenue Chart** for monthly income trends.",
                "Analyze **Shipment Status** pie chart for operational overview.",
                "Check **Recent Activity** feed for latest system events.",
                "Use **System Health** indicators to monitor platform status.",
                "All data is **real-time** and updates automatically."
            ],
            link: "/admin"
        }
    ];

    const filteredGuides = guides.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-6 md:p-10 min-h-screen bg-[#F2F6FC] space-y-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-blue/20">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-3">Admin Knowledge Base</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base">
                        Your comprehensive resource for every admin task. From handling customer requests to managing shipments,
                        this knowledge base contains **everything you need** to efficiently operate the Marqmike platform.
                        <strong className="text-brand-blue block mt-2">Search below to find instant solutions.</strong>
                    </p>
                </header>

                {/* Search */}
                <div className="relative max-w-xl mx-auto mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for a guide..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-brand-blue/20 outline-none text-slate-700 font-medium"
                    />
                </div>

                {/* Guides Grid */}
                <div className="grid gap-6">
                    {filteredGuides.map((guide, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0">
                                    <guide.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{guide.title}</h3>
                                    <p className="text-slate-500 mb-6">{guide.desc}</p>

                                    <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Procedure</h4>
                                        <ul className="space-y-3">
                                            {guide.steps.map((step, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                                    <span className="font-bold text-brand-blue/50">{i + 1}.</span>
                                                    <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {guide.link && (
                                        <Link
                                            href={guide.link}
                                            className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-brand-blue hover:text-white transition-all"
                                        >
                                            Go to Page <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
