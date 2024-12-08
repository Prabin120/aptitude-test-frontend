import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListIcon as Category } from 'lucide-react'
import { handleGetMethod } from "@/utils/apiCall"
import { usePathname } from 'next/navigation'
import { getAptiQuestionTagEndpoint } from "@/consts"

interface TestCard {
    _id: string
    value: string
    summary: string
    // questionsCount: number
    // icon: React.ReactNode
}

function TestCardComponent({ test, type }: Readonly<{ test: TestCard, type: string }>) {
    const pathname = usePathname()
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{test.value}</CardTitle>
                </div>
                <CardDescription>{test.summary}</CardDescription>
            </CardHeader>
            {/* <CardContent>
                <p className="text-sm text-muted-foreground">Questions: {test.questionsCount}</p>
            </CardContent> */}
            <CardFooter className="mt-auto">
                <Button asChild className="w-full">
                    <Link href={pathname + "/" + type + "/" + test.value}>Start Test</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function AptitudeListingPage() {
    const [topicFields, setTopicFields] = useState<{ _id: string, value: string, summary: string }[]>([])
    const [categoryFields, setCategoryFields] = useState<{ _id: string, value: string, summary: string }[]>([])
    const [companyFields, setCompanyFields] = useState<{ _id: string, value: string, summary: string }[]>([])
    useEffect(() => {
        (async () => {
            const response = await handleGetMethod(getAptiQuestionTagEndpoint)
            if (response instanceof Response) {
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    const { topics, categories, companies } = res
                    setTopicFields(topics)
                    setCategoryFields(categories)
                    setCompanyFields(companies)
                } else {
                    alert("Error fetching question tags")
                }
            } else {
                alert("Error fetching question tags")
            }
        })()
    }, [handleGetMethod, getAptiQuestionTagEndpoint])
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Tests</h1>
            </div>

            {/* <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Popular Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularTests.map((test) => (
                        <TestCardComponent key={test._id} test={test} />
                    ))}
                </div>
            </section> */}

            <h2 className="text-lg mb-2">Upcoming Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {topicFields.map((test) => (
                    <TestCardComponent key={test._id} test={test} type="topic" />
                ))}
            </div>
            <h2 className="text-lg mb-2">Past Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categoryFields.map((test) => (
                    <TestCardComponent key={test._id} test={test} type="category" />
                ))}
            </div>
        </div>
    )
}