"use client"

import { motion } from "framer-motion"
import { Award, Check, Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RewardsTiers() {
  const tiers = [
    {
      name: "Bronze",
      icon: <Award className="h-5 w-5 text-amber-700" />,
      requirement: "0+ lifetime coins",
      benefits: ["Basic withdrawal options", "Standard contribution rewards"],
      current: true,
      completed: true,
    },
    {
      name: "Silver",
      icon: <Award className="h-5 w-5 text-gray-400" />,
      requirement: "1,000+ lifetime coins",
      benefits: ["Priority review queue", "5% bonus on contributions"],
      current: true,
      completed: true,
    },
    {
      name: "Gold",
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      requirement: "2,000+ lifetime coins",
      benefits: ["10% bonus on contributions", "Custom profile badge", "Early access to new features"],
      current: false,
      completed: false,
    },
    {
      name: "Platinum",
      icon: <Award className="h-5 w-5 text-blue-300" />,
      requirement: "5,000+ lifetime coins",
      benefits: ["15% bonus on contributions", "Featured contributor status", "Exclusive workshops access"],
      current: false,
      completed: false,
    },
    {
      name: "Diamond",
      icon: <Award className="h-5 w-5 text-cyan-300" />,
      requirement: "10,000+ lifetime coins",
      benefits: ["20% bonus on all earnings", "Platform advisory board", "Free premium subscription"],
      current: false,
      completed: false,
    },
  ]

  return (
    <Card className=" h-full">
      <CardHeader>
        <CardTitle className="text-xl">Reward Tiers</CardTitle>
        <CardDescription>Unlock benefits as you earn more</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Current Tier: Silver</span>
            <span className="text-sm text-gray-400">Progress to Gold</span>
          </div>
          <Progress value={72.5} className="h-2 bg-gray-800">
            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
          </Progress>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>1,450 coins</span>
            <span>2,000 coins</span>
          </div>
        </div>

        <div className="space-y-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className={`p-3 rounded-lg border ${
                  tier.current ? "bg-gray-800/70 border-purple-700" : "bg-gray-800/30 border-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {tier.icon}
                  <span className="font-medium">{tier.name}</span>
                  {tier.current && (
                    <span className="ml-auto text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Coins className="h-3 w-3 text-yellow-500" />
                    {tier.requirement}
                  </div>
                </div>
                <div className="space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-1 text-xs text-gray-300">
                      <Check className="h-3 w-3 text-green-500 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
