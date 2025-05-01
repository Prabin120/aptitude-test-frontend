"use client"

import { motion } from "framer-motion"
import { Users, Code, Award, BookOpen } from "lucide-react"

export default function StatisticsSection() {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-purple-400" />,
      value: "50,000+",
      label: "Active Users",
    },
    {
      icon: <Code className="h-8 w-8 text-blue-400" />,
      value: "1,000+",
      label: "Coding Challenges",
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-400" />,
      value: "500+",
      label: "Global Competitions",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-400" />,
      value: "10,000+",
      label: "Questions Contributed",
    },
  ]

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
