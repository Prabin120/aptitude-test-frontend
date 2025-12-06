'use client'
import { ArrowRight, Brain, Clock, Code, FileSpreadsheet, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const features = [
    {
        title: "Coding Practice",
        icon: Code,
        description: "Sharpen your programming skills with our diverse set of coding challenges",
        href: "/code/problems",
        color: "bg-gradient-to-r from-neutral-500 to-neutral-900",
        stats: { challenges: 500, languages: 10 },
        popularTopics: ["Data Structures", "Algorithms", "Web Development"],
    },
    {
        title: "Aptitude Questions",
        icon: Brain,
        description: "Boost your logical and analytical thinking with our aptitude question bank",
        href: "/apti-zone",
        color: "bg-gradient-to-r from-neutral-900 to-neutral-500",
        stats: { questions: 1000, categories: 15 },
        popularTopics: ["Numerical Reasoning", "Verbal Ability", "Logical Reasoning"],
    },
    {
        title: "Exam Mode",
        icon: FileSpreadsheet,
        description: "Test your knowledge under timed conditions to simulate real exam scenarios",
        href: "/tests",
        color: "bg-gradient-to-r from-neutral-500 to-neutral-900",
        stats: { exams: 50, duration: "1-3 hours" },
        popularTopics: ["Mock Tests", "Sectional Practice", "Performance Analysis"],
    },
]

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Welcome to AptiCode
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Discover your potential with our comprehensive aptitude tests. Challenge yourself and unlock new
                                    opportunities.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Link href={`/tests`}>
                                    <Button variant="secondary" className="h-11 px-8 animate-pulse" size="lg">
                                        Register for a Test
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="px-2 py-4 my-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Link href={feature.href} key={index}>
                            <Card key={index + 1} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <CardHeader className={`${feature.color} text-white p-6`}>
                                    <div className="flex items-center justify-between">
                                        <feature.icon className="w-12 h-12" />
                                        <Badge variant="secondary" className="text-sm font-medium">
                                            {Object.values(feature.stats)[0]}+ {Object.keys(feature.stats)[0]}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl mt-4">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                                            <span>Popular Topics:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {feature.popularTopics.map((topic, i) => (
                                                <Badge key={i} variant="outline">{topic}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/50 p-6 flex flex-col space-y-4">
                                    <div className="flex items-center justify-between text-sm w-full">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>Updated daily</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            <span>10k+ users</span>
                                        </div>
                                    </div>
                                    <Progress value={33} className="w-full" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-900">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Accurate Results</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Our tests are designed by experts to provide precise insights into your abilities.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Secure Platform</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Your data and test results are protected with state-of-the-art security measures.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                                <div className="p-2 bg-black bg-opacity-50 rounded-full">
                                    <svg
                                        className=" text-white h-6 w-6"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">Instant Feedback</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Get immediate results and personalized insights after completing your test.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}