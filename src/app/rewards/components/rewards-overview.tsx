"use client"

import { motion } from "framer-motion"
import { Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ICoin } from "../schema"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createRewardOrder, verifyRewardCoins } from "@/consts"
import { handlePostMethod } from "@/utils/apiCall"
import { checkAuthorization } from "@/utils/authorization"
import { setUserState } from "@/redux/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { handleRazorpayPayment } from "@/utils/razorpayPaymentModal"

export default function RewardsOverview({ overview, setOverview }: { overview: ICoin, setOverview: (val: ICoin) => void }) {
  const stats = [
    {
      title: "Current Balance",
      value: overview.balance,
    },
    {
      title: "Lifetime Earnings",
      value: overview.lifetimeEarnings,
    },
    {
      title: "Total Withdrawn",
      value: overview.totalWithdraw,
    },
  ]
  const [addCoins, setAddCoins] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const userDetail = useAppSelector((state) => state.user);
  const handleAddCoins = async () => {
    try {
      if (!addCoins) {
        return
      }
      const response = await handlePostMethod(createRewardOrder, { amount: Number(addCoins) });
      if (response instanceof Response) {
        await checkAuthorization(response, dispatch);
        const res = await response.json()
        if (response.status === 200 || response.status === 201) {
          await handleRazorpayPayment(res.amount, res.order_id, verifyRewardCoins, userDetail.name, userDetail.email, { orderId: res.order_id })
          dispatch(setUserState({ ...userDetail, coins: Number(userDetail.coins) + Number(addCoins) }))
          setIsModalOpen(false);
          setOverview({ ...overview, balance: Number(overview.balance) + Number(addCoins) })
        } else {
          alert(res.message);
        }
      } else {
        alert("Server error")
      }
    } catch (error) {
      console.error("Error submitting test cases:", error)
      alert("An error occurred while submitting test cases. Please try again.")
    }
  }

  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          Rewards Overview
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant={"secondary"} type="button">Contribute to Earn</Button>
            </Link>
            <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">Add Coins</Button>
          </div>
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
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center">
                    {stat.title === "Current Balance" || stat.title === "Lifetime Earnings" ? (
                      <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                    ) : null}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
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
            {overview.balance >= 100 ?
              <div className="mt-1 text-xs text-green-500">You can withdraw now! Minimum amount reached.</div>
              :
              <div className="mt-1 text-xs text-gray-400">Minimum 100 coins to withdraw.</div>
            }
          </div>
        </div>
      </CardContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Insert Table"
          >
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add coins</DialogTitle>
            <DialogDescription>Enter the number of coins you want to add (1 rupees = 1 coin)</DialogDescription>
            <Input type="number" value={addCoins} onChange={(e) => setAddCoins(e.target.value)} />
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleAddCoins}>Add Coins</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
