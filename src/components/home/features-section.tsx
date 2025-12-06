"use client"

import { motion } from "framer-motion"
import { Code, Users, Trophy, Coins } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-blue-400" />,
      title: "Practice Coding",
      description:
        "Sharpen your programming skills with hundreds of challenges across different difficulty levels and domains.",
      color: "from-blue-600 to-cyan-600",
    },
    {
      icon: <Users className="h-10 w-10 text-purple-400" />,
      title: "Group Tests",
      description:
        "Create custom tests and invite friends or colleagues to participate. Perfect for study groups and team building.",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: <Trophy className="h-10 w-10 text-yellow-400" />,
      title: "Global Competitions",
      description:
        "Participate in platform-wide competitions, test your skills against others, and win exciting prizes.",
      color: "from-yellow-600 to-orange-600",
    },
    {
      icon: <Coins className="h-10 w-10 text-green-400" />,
      title: "Earn Rewards",
      description:
        "Contribute questions to the platform and earn coins that can be redeemed for various rewards and benefits.",
      color: "from-green-600 to-emerald-600",
    },
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything You Need to Excel
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Our platform offers a comprehensive suite of tools and features to help you improve your coding skills and
            prepare for technical interviews.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="bg-gray-900 border-gray-800 h-full overflow-hidden">
                <div className={`h-1 w-full bg-gradient-to-r ${feature.color}`}></div>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
