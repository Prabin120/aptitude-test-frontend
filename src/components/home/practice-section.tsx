"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code, Calculator, Brain, ArrowRight, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function PracticeSection() {
  const codingProblems = [
    {
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      completion: 85,
    },
    {
      title: "Merge Intervals",
      difficulty: "Medium",
      tags: ["Arrays", "Sorting"],
      completion: 65,
    },
    {
      title: "LRU Cache",
      difficulty: "Hard",
      tags: ["Hash Table", "Linked List"],
      completion: 40,
    },
  ]

  const quantProblems = [
    {
      title: "Probability Distribution",
      difficulty: "Medium",
      tags: ["Statistics", "Probability"],
      completion: 70,
    },
    {
      title: "Linear Equations",
      difficulty: "Easy",
      tags: ["Algebra", "Equations"],
      completion: 90,
    },
    {
      title: "Permutation & Combination",
      difficulty: "Hard",
      tags: ["Combinatorics", "Counting"],
      completion: 55,
    },
  ]

  const aptitudeProblems = [
    {
      title: "Logical Reasoning",
      difficulty: "Medium",
      tags: ["Logic", "Patterns"],
      completion: 75,
    },
    {
      title: "Verbal Ability",
      difficulty: "Easy",
      tags: ["Grammar", "Vocabulary"],
      completion: 80,
    },
    {
      title: "Data Interpretation",
      difficulty: "Hard",
      tags: ["Charts", "Analysis"],
      completion: 60,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-900/20 text-green-400 border-green-800/50"
      case "Medium":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800/50"
      case "Hard":
        return "bg-red-900/20 text-red-400 border-red-800/50"
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-800/50"
    }
  }

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
            Practice Makes Perfect
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Enhance your skills with our comprehensive practice platform covering coding, quantitative, and aptitude
            challenges.
          </motion.p>
        </div>

        <Tabs defaultValue="coding" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="coding" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Coding</span>
              </TabsTrigger>
              <TabsTrigger value="quant" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Quantitative</span>
              </TabsTrigger>
              <TabsTrigger value="aptitude" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Aptitude</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="coding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {codingProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-purple-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">{problem.title}</h3>
                      <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{problem.completion}% completion rate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>~25 mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/code/problems">
                    Explore All Coding Problems <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="quant">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {quantProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-purple-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">{problem.title}</h3>
                      <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{problem.completion}% completion rate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>~20 mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/apti-zone">
                    Explore All Quantitative Problems <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="aptitude">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {aptitudeProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-purple-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">{problem.title}</h3>
                      <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{problem.completion}% completion rate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>~15 mins</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/apti-zone">
                    Explore All Aptitude Problems <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
