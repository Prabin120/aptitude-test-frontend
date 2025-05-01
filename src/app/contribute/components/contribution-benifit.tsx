"use client"

import { motion } from "framer-motion"
import { Brain, Coins, Trophy, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContributionBenefits() {
  const benefits = [
    {
      icon: <Coins className="h-10 w-10 text-yellow-500" />,
      title: "Earn Rewards",
      description: "Get 30 coins for each approved contribution that you can redeem for real rewards.",
    },
    {
      icon: <Brain className="h-10 w-10 text-purple-400" />,
      title: "Improve Skills",
      description: "Sharpen your coding skills by creating and reviewing challenging problems.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-400" />,
      title: "Build Community",
      description: "Connect with like-minded developers and grow your professional network.",
    },
    {
      icon: <Trophy className="h-10 w-10 text-green-400" />,
      title: "Gain Recognition",
      description: "Get featured on our leaderboard and earn badges for quality contributions.",
    },
  ]

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Contribute?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Contributing to our platform offers multiple benefits beyond just earning rewards. Here&apos;s what you gain by
          becoming an active contributor.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-900 border-gray-800 h-full">
              <CardHeader>
                <div className="mb-4">{benefit.icon}</div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
