"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Code, Coins, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContributionHero() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev < 30 ? prev + 1 : 30))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0"></div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600 mb-4">
              Contribute & Earn
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Share your coding expertise, help others learn, and earn rewards for your contributions.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin">
                <Button className="bg-primary hover:bg-primary/90 text-primary-text">Start Contributing</Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Join 5,000+ contributors worldwide</span>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-pink-600 rounded-lg blur opacity-75"></div>
          <div className="relative bg-black rounded-lg p-6 border border-primary/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span className="font-mono text-primary/80">contribution.js</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div className="font-mono text-yellow-500 flex items-center">
                  <span className="inline-block w-8 text-right">{count}</span>
                  <span>/30</span>
                </div>
              </div>
            </div>
            <div className="font-mono text-sm bg-black/80 p-4 rounded border border-gray-800 space-y-2">
              <div className="text-gray-500">${`// Your contribution`}</div>
              <div>
                <span className="text-primary">function</span> <span className="text-blue-400">solveChallenge</span>
                <span className="text-gray-300">(</span>
                <span className="text-orange-300">input</span>
                <span className="text-gray-300">) {`{`}</span>
              </div>
              <div className="pl-4">
                <span className="text-primary">const</span> <span className="text-blue-300">result</span>
                <span className="text-gray-300"> = </span>
                <span className="text-orange-300">input</span>
                <span className="text-gray-300">.</span>
                <span className="text-green-400">map</span>
                <span className="text-gray-300">((</span>
                <span className="text-orange-300">num</span>
                <span className="text-gray-300">) =&gt; </span>
                <span className="text-orange-300">num</span>
                <span className="text-gray-300"> * </span>
                <span className="text-yellow-300">2</span>
                <span className="text-gray-300">);</span>
              </div>
              <div className="pl-4">
                <span className="text-primary">return</span> <span className="text-blue-300">result</span>
                <span className="text-gray-300">;</span>
              </div>
              <div>
                <span className="text-gray-300">{`}`}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Status: <span className="text-green-400">Under Review</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 text-sm">+30 coins on approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
