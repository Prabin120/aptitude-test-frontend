"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ICoin } from "../schema"

export default function RewardsOverview({overview}: {overview: ICoin}) {
  const stats = [
    {
      title: "Current Balance",
      value: overview.balance,
      // icon: <Coins className="h-5 w-5 text-yellow-500" />,
      // change: "+30 this week",
      // trend: "up",
    },
    {
      title: "Lifetime Earnings",
      value: overview.lifetimeEarnings,
      // icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      // change: "7 contributions",
      // trend: "up",
    },
    {
      title: "Total Withdrawn",
      value: overview.totalWithdraw,
      // icon: <Wallet className="h-5 w-5 text-purple-500" />,
      // change: "Last: 2 weeks ago",
      // trend: "neutral",
    },
  ]

  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">Rewards Overview
          <Link href="/admin">
            <Button variant={"secondary"} type="button">Contribute to Earn</Button>
          </Link>
        </CardTitle>
        <CardDescription>Track your earnings and balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex flex-col p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{stat.title}</span>
                  {/* {stat.icon} */}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center">
                    {stat.title === "Current Balance" || stat.title === "Lifetime Earnings" ? (
                      <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    ) : null}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {/* {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />}
                  <span className={`${stat.trend === "up" ? "text-green-500" : "text-gray-400"}`}>{stat.change}</span> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Next Withdrawal Available</span>
              <span className="text-sm text-gray-400">{overview.balance}/100</span>
            </div>
            <Progress value={overview.balance} className="h-2 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full" />
            </Progress>
            { overview.balance >= 100 ? 
              <div className="mt-1 text-xs text-green-500">You can withdraw now! Minimum amount reached.</div>
              :
              <div className="mt-1 text-xs text-gray-400">Minimum 100 coins to withdraw.</div>
            }
            {/* <div className="mt-1 text-xs text-green-500">You can withdraw now! Minimum amount reached.</div> */}
          </div>

          {/* <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Next Tier: Gold Contributor</span>
              <span className="text-sm text-gray-400">1,450/2,000</span>
            </div>
            <Progress value={72.5} className="h-2 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
            </Progress>
            <div className="mt-1 text-xs text-gray-400">Earn 550 more coins to reach Gold tier</div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
