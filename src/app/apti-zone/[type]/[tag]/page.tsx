"use client"

import QuestionTable from "./table"
import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { Problem } from "../../commonInterface"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { getAptiQuestionByTag } from "../../apicalls"

export default function ProblemListPage(context: Readonly<{ params: Params }>) {
    const [problems, setProblems] = useState<Problem[]>()
    const { type, tag } = context.params
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        setLoading(true)
        setError("");
        (async () => {
            const response = await getAptiQuestionByTag(type, tag, page, 10)
            setProblems(response.data)
            setTotalPages(response.totalPages)
        })()
            .catch((err) => {
                setError("Failed to load questions. Please try again." + err);
            })
            .finally(() => {
                setLoading(false)
            })
    }, [type, tag, page])

    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <div className="pt-3">
                        <QuestionsFilters type={type} tag={tag} />
                    </div>
                </div>
                {loading ? (
                    <div>Loading questions...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <QuestionTable data={problems} currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
        </ReduxProvider>
    )
}