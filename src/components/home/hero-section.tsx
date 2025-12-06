"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Brain, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const features = ["Code", "Compete", "Contribute", "Earn"]
  const colors = ["text-blue-400", "text-purple-400", "text-green-400", "text-yellow-400"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background elements */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-900/30 rounded-full blur-3xl"></div> */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Learn. <span className={colors[currentFeature]}>{features[currentFeature]}.</span> Grow.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              The ultimate platform for developers to practice coding, compete in challenges, and earn rewards through
              contributions.
            </p>
            <div className="flex flex-wrap gap-4">
                <Link href="/login">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-950/50">
                Explore Features
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">100+ Challenges</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">Aptitude Tests</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Win Prizes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Group Tests</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75"></div>
            <div className="relative bg-black rounded-lg p-6 border border-purple-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-gray-400">AptiCode Challenge</div>
              </div>
              <div className="font-mono text-sm bg-black/80 p-4 rounded border border-gray-800 space-y-2">
                <div className="text-gray-500">{`// Solve the challenge`}</div>
                <div>
                  <span className="text-purple-400">function</span>{" "}
                  <span className="text-blue-400">findMaxSubarraySum</span>
                  <span className="text-gray-300">(</span>
                  <span className="text-orange-300">arr</span>
                  <span className="text-gray-300">) {`{`}</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">let</span> <span className="text-blue-300">maxSoFar</span>
                  <span className="text-gray-300"> = </span>
                  <span className="text-orange-300">arr</span>
                  <span className="text-gray-300">[</span>
                  <span className="text-yellow-300">0</span>
                  <span className="text-gray-300">];</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">let</span> <span className="text-blue-300">maxEndingHere</span>
                  <span className="text-gray-300"> = </span>
                  <span className="text-orange-300">arr</span>
                  <span className="text-gray-300">[</span>
                  <span className="text-yellow-300">0</span>
                  <span className="text-gray-300">];</span>
                </div>
                <div className="pl-4 text-gray-500">{`// Your solution here...`}</div>
                <div>
                  <span className="text-gray-300">{`}`}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Difficulty: <span className="text-yellow-500">Medium</span>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Submit Solution
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
