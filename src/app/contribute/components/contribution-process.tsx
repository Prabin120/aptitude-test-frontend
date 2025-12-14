"use client"

import { motion } from "framer-motion"
import { CheckCircle, Edit, FileCode, Send, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ContributionProcess() {
  const steps = [
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: "Create",
      description: "Draft your coding challenge with clear instructions and test cases.",
    },
    {
      icon: <Send className="h-8 w-8 text-blue-400" />,
      title: "Submit",
      description: "Submit your contribution for review by our expert team.",
    },
    {
      icon: <FileCode className="h-8 w-8 text-green-400" />,
      title: "Review",
      description: "Our team reviews your submission for quality and accuracy.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-yellow-500" />,
      title: "Approve",
      description: "Once approved, your contribution goes live on the platform.",
    },
    {
      icon: <ThumbsUp className="h-8 w-8 text-pink-400" />,
      title: "Reward",
      description: "Receive 30 coins for each approved contribution.",
    },
  ]

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Contributing is simple. Follow these steps to share your knowledge and earn rewards.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-pink-600 hidden md:block"></div>

        <div className="space-y-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card
                className={`bg-gray-900 border-gray-800 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
              >
                <CardContent className="p-6">
                  <div
                    className=" hidden md:block 
                    bg-gray-900 rounded-full p-2 border-4 border-gray-800
                    ">
                    {step.icon}
                  </div>
                  <div className="md:hidden flex items-center gap-4 mb-4">
                    <div className="bg-gray-800 rounded-full p-2">{step.icon}</div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold hidden md:block mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
