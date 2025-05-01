"use client"

import RewardsOverview from "./components/rewards-overview"
import WithdrawForm from "./components/withdraw-form"
import TransactionHistory from "./components/transaction-history"
import { useEffect, useState } from "react"
import { handleGetMethod } from "@/utils/apiCall"
import { rewardDashboard } from "@/consts"
import { ICoin, ICoinTransaction } from "./schema"


export default function RewardsPage() {
    const [overView, setOverView] = useState<ICoin>({ username: "", balance: 0, lifetimeEarnings: 0, totalWithdraw: 0 });
    const [transactions, setTransactions] = useState<ICoinTransaction[]>([]);

    useEffect(() => {
        (async () => {
            const response = await handleGetMethod(rewardDashboard);
            if (response instanceof Response) {
                const res = await response.json();
                console.log(res);
                if (response.status === 200 || response.status === 201) {
                    setOverView(res.coins);
                    setTransactions(res.history);
                }
            }
        })();
    }, [rewardDashboard]);
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                {/* <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Your Rewards Dashboard
                </h1> */}
                <h1 className="text-3xl md:text-4xl font-bold mb-8">
                    Your Rewards Dashboard
                </h1>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <RewardsOverview overview={overView} />
                    </div>
                    <div>
                        <WithdrawForm />
                    </div>
                </div>

                <div className="mb-8">
                    <TransactionHistory transactions={transactions} />
                </div>
                {/* <div>
            <RewardsTiers />
          </div> */}
                {/* <div className="lg:col-span-2">
            <EarningsChart />
          </div> */}
            </div>
        </div>
    )
}
