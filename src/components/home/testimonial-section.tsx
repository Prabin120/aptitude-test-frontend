"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Trophy, Clock, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TestsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Test Your Skills, Challenge Others</h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you want to practice with friends or compete globally, our testing platform has you covered with
              flexible options for every need.
            </p>

            <Tabs defaultValue="group" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="group">Group Tests</TabsTrigger>
                <TabsTrigger value="global">Global Competitions</TabsTrigger>
              </TabsList>
              <TabsContent value="group" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/30 p-2 rounded-full">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Create Custom Tests</h3>
                      <p className="text-gray-400">
                        Design personalized tests with specific topics, difficulty levels, and time constraints.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/30 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Real-time Results</h3>
                      <p className="text-gray-400">
                        Watch as participants complete the test and see results update in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-900/30 p-2 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Schedule Tests</h3>
                      <p className="text-gray-400">
                        Plan ahead by scheduling tests for future dates and sending automatic invitations.
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild className="mt-6">
                  <Link href="/group-test">
                    Create a Group Test <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TabsContent>
              <TabsContent value="global" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-900/30 p-2 rounded-full">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Win Exciting Prizes</h3>
                      <p className="text-gray-400">
                        Compete against developers worldwide and win prizes based on your performance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-900/30 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Weekly Challenges</h3>
                      <p className="text-gray-400">
                        New competitions every week with fresh problems and different focus areas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-900/30 p-2 rounded-full">
                      <Users className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Global Leaderboard</h3>
                      <p className="text-gray-400">
                        Track your progress and see how you rank against other participants worldwide.
                      </p>
                    </div>
                  </div>
                </div>
                <Button asChild className="mt-6 bg-yellow-600 hover:bg-yellow-700">
                  <Link href="/tests">
                    Join Global Competition <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75"></div>
              <Card className="relative bg-black border-purple-800/50">
                <CardContent className="p-0">
                  <div className="bg-gray-900/50 p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium">Algorithm Challenge</h3>
                      </div>
                      <div className="text-sm text-gray-400">8 participants</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium mb-2">Current Standings</h4>
                        <div className="space-y-3">
                          {[
                            { name: "Alex Chen", score: 95, time: "12:45" },
                            { name: "Sarah Kim", score: 90, time: "14:20" },
                            { name: "Miguel Rodriguez", score: 85, time: "15:10" },
                            { name: "Priya Sharma", score: 80, time: "16:30" },
                          ].map((participant, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                index === 0
                                  ? "bg-yellow-900/20 border border-yellow-800/50"
                                  : "bg-gray-800/30 border border-gray-700/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    index === 0
                                      ? "bg-yellow-500 text-black"
                                      : index === 1
                                        ? "bg-gray-400 text-black"
                                        : index === 2
                                          ? "bg-amber-700 text-white"
                                          : "bg-gray-700 text-white"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <span>{participant.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400">{participant.time}</span>
                                <span className={`font-medium ${index === 0 ? "text-yellow-400" : "text-gray-300"}`}>
                                  {participant.score}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-400">Time Remaining</div>
                          <div className="text-xl font-mono">00:45:22</div>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
