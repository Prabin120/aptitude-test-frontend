"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListIcon as Category } from 'lucide-react'
import { Search } from "@/components/ui/search"
import { useRouter } from "next/navigation"
import { HeaderBackWithText } from "@/components/headerBackWithText"

interface TestCard {
    _id: string
    value: string
    summary: string
}

function TestCardComponent({ test, type }: Readonly<{ test: TestCard, type: string }>) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center space-x-3 my-4">
                    <Category className="h-6 w-6" />
                    <CardTitle className="">{test.value}</CardTitle>
                </div>
                <CardDescription>{test.summary}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-text">
                    <Link href={type + "/" + test.value}>See Problems</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

interface QuestionTypeClientProps {
    type: string
    initialQuestions: TestCard[]
    initialSearch?: string
}

export default function QuestionTypeClient({ type, initialQuestions, initialSearch }: QuestionTypeClientProps) {
    const [allQuestions] = useState<TestCard[]>(initialQuestions)
    const [filteredQuestions, setFilteredQuestions] = useState<TestCard[]>(initialQuestions)
    const [search, setSearch] = useState(initialSearch || "")
    const router = useRouter()

    // useEffect(() => {
    // }, [allQuestions])

    const handleSearch = (searchVal: string) => {
        setSearch(searchVal)
        const params = new URLSearchParams(window.location.search)
        if (searchVal) {
            params.set('search', searchVal)
        } else {
            params.delete('search')
        }
        const lowerSearch = search.toLowerCase()
        const filtered = allQuestions.filter(q =>
            q.value.toLowerCase().includes(lowerSearch)
        )
        setFilteredQuestions(filtered)
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    if (!allQuestions.length) {
        return <div className="container mx-auto py-8">
            <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
                    <p className="text-gray-600">We couldn&apos;t find any questions matching your search criteria.</p>
                </div>
            </div>
        </div>
    }

    return (
        <div className="container mx-auto py-5">
            <div className="flex justify-between items-center mb-2 flex-row gap-2">
                <HeaderBackWithText text={type.charAt(0).toUpperCase() + type.slice(1)} href="/aptitude" />
                <Search
                    placeholder={`Search...`}
                    value={search}
                    onChange={(val) => setSearch(val)}
                    onClick={() => { handleSearch(search) }}
                    className="flex-1 max-w-[200px] sm:max-w-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredQuestions.map((test) => (
                    <TestCardComponent key={test._id} test={test} type={type} />
                ))}
            </div>
        </div>
    )
}
