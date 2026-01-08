"use client";

import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Truck } from "lucide-react";

export default function TransactionHistory() {
    const transactions = [
        { id: 1, type: "debit", title: "Shipping Payment", subtitle: "Tracking #MQM-8821", amount: 150.00, currency: "USD", date: "Today, 10:23 AM", icon: Truck },
        { id: 2, type: "credit", title: "Wallet Top Up", subtitle: "Mobile Money", amount: 500.00, currency: "USD", date: "Yesterday, 4:15 PM", icon: ArrowDownLeft },
        { id: 3, type: "debit", title: "Procurement Order", subtitle: "iPhone 15 Case x50", amount: 320.50, currency: "USD", date: "Jun 18, 2024", icon: ShoppingBag },
        { id: 4, type: "credit", title: "Refund", subtitle: "Out of Stock Item", amount: 45.00, currency: "USD", date: "Jun 15, 2024", icon: ArrowDownLeft },
    ];

    return (
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                <button className="text-xs font-bold text-brand-blue hover:text-blue-700">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-blue-50/30 transition-colors group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-brand-blue group-hover:shadow-md transition-all'}`}>
                                <tx.icon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{tx.title}</p>
                                <p className="text-xs text-slate-400">{tx.subtitle}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold font-mono ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
