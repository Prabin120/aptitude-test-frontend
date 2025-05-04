"use client"

import RewardsOverview from "./components/rewards-overview"
import WithdrawForm from "./components/withdraw-form"
import TransactionHistory from "./components/transaction-history"
import { useEffect, useState } from "react"
import { handleGetMethod } from "@/utils/apiCall"
import { rewardDashboard } from "@/consts"
import { ICoin, IHistory } from "./schema"
import Loading from "../loading"
import ReduxProvider from "@/redux/redux-provider"


export default function RewardsPage() {
    const [overView, setOverView] = useState<ICoin>({ username: "", balance: 0, lifetimeEarnings: 0, totalWithdraw: 0 });
    const [history, setHistory] = useState<IHistory>({ transactions: [], total: 0, page: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setLoading(true);
        (async () => {
            const response = await handleGetMethod(rewardDashboard, `filter=${filter}`);
            if (response instanceof Response) {
                const res = await response.json();
                console.log(res);
                if (response.status === 200 || response.status === 201) {
                    setOverView(res.coins);
                    setHistory(res.history);
                }
            }
            setLoading(false);
        })();
    }, [rewardDashboard, filter]);
    if (loading) {
        return <Loading/>
    }
    return (
        <ReduxProvider>
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">
                        Your Rewards Dashboard
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                            <RewardsOverview overview={overView} setOverview={setOverView} />
                        </div>
                        <div>
                            <WithdrawForm />
                        </div>
                    </div>

                    <div className="mb-8">
                        <TransactionHistory history={history} filter={filter} setFilter={setFilter} />
                    </div>
                </div>
            </div>
        </ReduxProvider>
    )
}
