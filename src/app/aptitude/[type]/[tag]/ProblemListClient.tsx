"use client"

import QuestionTable from "./table"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { Problem } from "../../commonInterface"

interface Props {
    type: string
    tag: string
    initialProblems?: Problem[]
    initialTotalPages?: number
}

import { useRouter, useSearchParams } from "next/navigation"

export default function ProblemListClient({ type, tag, initialProblems, initialTotalPages }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const problems = initialProblems
    const totalPages = initialTotalPages || 1
    const currentPage = Number(searchParams.get('page')) || 1

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <div className="pt-3">
                        <QuestionsFilters type={type} tag={tag} />
                    </div>
                </div>
                {!problems ? (
                    <div className="py-10 text-center">Loading questions...</div>
                ) : (
                    <QuestionTable data={problems} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
            </div>
        </ReduxProvider>
    )
}
