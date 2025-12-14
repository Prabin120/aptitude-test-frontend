"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Edit, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ContributeSection() {
  const steps = [
    {
      icon: <Edit className="h-6 w-6 text-primary" />,
      title: "Create a Question",
      description: "Design a challenging problem with clear instructions and test cases.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      title: "Get Approved",
      description: "Our team reviews your submission for quality and accuracy.",
    },
    {
      icon: <Coins className="h-6 w-6 text-yellow-400" />,
      title: "Earn Rewards",
      description: "Receive 30 coins for each approved contribution.",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/10 to-black"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-primary rounded-lg blur opacity-75"></div>
              <Card className="relative bg-black border-primary/50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-primary"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-900/30 p-2 rounded-full">
                      <Coins className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold">Contribution Rewards</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Your Contributions</span>
                        <span className="text-primary">7 approved</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Current Balance</span>
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-yellow-400">210 coins</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Lifetime Earnings</span>
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-yellow-400">1,450 coins</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Recent Contributions</h4>
                      {[
                        {
                          title: "Dynamic Programming Challenge",
                          status: "Approved",
                          date: "2 days ago",
                          coins: 30,
                        },
                        {
                          title: "Binary Search Tree Implementation",
                          status: "Approved",
                          date: "1 week ago",
                          coins: 30,
                        },
                        {
                          title: "Advanced Sorting Algorithm",
                          status: "Under Review",
                          date: "Just now",
                          coins: 0,
                        },
                      ].map((contribution, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-900/30 border border-gray-800 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{contribution.title}</div>
                            <div className="text-sm text-gray-400">{contribution.date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {contribution.status === "Approved" ? (
                              <>
                                <span className="text-green-400 text-sm">Approved</span>
                                <div className="flex items-center">
                                  <Coins className="h-3 w-3 text-yellow-400 mr-1" />
                                  <span className="text-yellow-400">+{contribution.coins}</span>
                                </div>
                              </>
                            ) : (
                              <span className="text-yellow-400 text-sm">Under Review</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                      <Link href="/rewards">
                        View All Rewards <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contribute & Earn Rewards</h2>
            <p className="text-xl text-gray-300 mb-8">
              Share your knowledge with the community by contributing questions and earn coins that can be redeemed for
              valuable rewards.
            </p>

            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-full p-3 mt-1">
                    <div className="bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center">{step.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <Coins className="h-5 w-5" />
                <span className="font-medium">Earn 30 coins for each approved contribution</span>
              </div>
              <p className="text-gray-400">
                Your contributions help others learn while you earn rewards. Coins can be redeemed for premium
                subscriptions, workshop access, and more.
              </p>
            </div>

            <Button asChild className="bg-primary hover:bg-primary/80 text-primary-text">
              <Link href="/contribute">
                Start Contributing Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
