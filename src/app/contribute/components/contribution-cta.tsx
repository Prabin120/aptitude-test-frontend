"use client"

import { motion } from "framer-motion"
import { ArrowRight, Code, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ContributionCTA() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-black z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,50,255,0.4)_0%,transparent_40%)]"></div>

        <div className="relative z-10 p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-purple-900/50 rounded-full mb-6">
            <Coins className="h-8 w-8 text-yellow-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Contributing?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your knowledge, help others learn, and earn rewards for your contributions. Start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto">
                <span>Start Contributing</span>
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
            <Link href="/code/problems">
                <Button
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-950/50 text-lg px-8 py-6 h-auto"
                >
                    <Code className="mr-2 h-5 w-5" />
                    <span>Browse Questions</span>
                </Button>
            </Link>
          </div>

          <p className="mt-6 text-gray-400">Join 5,000+ contributors who are already earning rewards!</p>
        </div>
      </motion.div>
    </section>
  )
}
