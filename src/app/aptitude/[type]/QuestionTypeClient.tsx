"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ListIcon as Category } from 'lucide-react'
import { Search } from "@/components/ui/search"
import { useRouter } from "next/navigation"

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
    const [search, setSearch] = useState(initialSearch || "")
    const router = useRouter()

    useEffect(() => {
        setSearch(initialSearch || "")
    }, [initialSearch])

    const handleSearch = (searchVal: string) => {
        setSearch(searchVal) // Update input immediately

        // Debounce or trigger navigation
        // For now, consistent with previous behavior: simple onChange updates state, we could add debounce here if needed
        // But the previous implementation updated URL on every change? No, handleSearch was called on `onChange`. 
        // We should probably rely on `onClick` or debounce for performance, but user wants 'working'.

        const params = new URLSearchParams(window.location.search)
        if (searchVal) {
            params.set('search', searchVal)
        } else {
            params.delete('search')
        }
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8 flex-row gap-2">
                <Link href="/aptitude" className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"> <ArrowLeft className="h-4 w-4" /> Back</Link>
                <Search
                    placeholder={`Search...`}
                    value={search}
                    onChange={(val) => handleSearch(val)}
                    onClick={() => { }}
                    className="flex-1 max-w-[200px] sm:max-w-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {initialQuestions.map((test) => (
                    <TestCardComponent key={test._id} test={test} type={type} />
                ))}
            </div>
        </div>
    )
}
