"use client"

import { useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { FilterQuestionProps, Problem } from "../commonInterface"
import QuestionTable from "./table"
import { useRouter, useSearchParams } from "next/navigation"
import { HeaderBackWithText } from "@/components/headerBackWithText"

interface Props {
    initialProblems?: Problem[]
    initialTotalPages?: number
    initialSearch?: string
}

export default function AllQuestionsClient({ initialProblems, initialTotalPages, initialSearch }: Props) {
    const [searchQuery, setSearchQuery] = useState<FilterQuestionProps>({ title: initialSearch || "", type: "" })
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const router = useRouter()

    const problems = initialProblems
    const totalPages = initialTotalPages || 1

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    const handleSearchButton = () => {
        const title = searchQuery.title;
        router.push("all-questions/?search=" + title); // This might need adjustment if base path changes
    }

    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50 flex justify-between items-center my-5">
                    <HeaderBackWithText text="All Questions" href="/aptitude" />
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchButton={handleSearchButton} />
                    </div>
                </div>
                {!problems ?
                    <div className="py-10 text-center">Loading questions...</div> :
                    <QuestionTable data={problems} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                }
            </div>
        </ReduxProvider>
    )
}