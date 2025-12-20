"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListIcon as Category } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Search } from "@/components/ui/search"

interface TestCard {
    _id: string
    value: string
    summary: string
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
            <CardFooter className="mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-text">
                    <Link href={pathname + "/" + type + "/" + test.value}>See Problems</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

interface AptitudeListingClientProps {
    topics: TestCard[]
    categories: TestCard[]
    companies: TestCard[]
    initialSearch?: string
}

export default function AptitudeListingClient({ topics, categories, companies, initialSearch }: AptitudeListingClientProps) {
    const [search, setSearch] = useState(initialSearch || "")
    const router = useRouter()

    useEffect(() => {
        setSearch(initialSearch || "")
    }, [initialSearch])

    const handleSearch = (searchVal: string) => {
        setSearch(searchVal)
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
                <Button variant="link">
                    <Link href="/aptitude/all-questions">All Questions</Link>
                </Button>
                <Search
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => { setSearch(() => e) }}
                    onClick={() => handleSearch(search)}
                    className="flex-1 max-w-[200px] sm:max-w-sm"
                />
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-lg mb-2">Topics</h2>
                <Button variant="ghost">
                    <Link href="/aptitude/topic">See all Topics</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {topics.map((test) => (
                    <TestCardComponent key={test._id} test={test} type="topic" />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg mb-2">Categories</h2>
                <Button variant="ghost">
                    <Link href="/aptitude/category">See all Categories</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categories.map((test) => (
                    <TestCardComponent key={test._id} test={test} type="category" />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg mb-2">Company</h2>
                <Button variant="ghost">
                    <Link href="/aptitude/company">See all Companies</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {companies.map((test) => (
                    <TestCardComponent key={test._id} test={test} type="company" />
                ))}
            </div>
        </div>
    )
}
