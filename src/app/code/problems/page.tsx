"use client"

import QuestionTable from "./table"
import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { getAllQuestions } from "../apiCalls"
import { Problem } from "../commonInterface"

export default function ProblemListPage() {
    const [problems, setProblems] = useState<Problem[]>()
    const [searchQuery, setSearchQuery] = useState("")
    useEffect(() => {
        (async () => {
            const data = await getAllQuestions()
            setProblems(data)
        })()
    }, [getAllQuestions])

    const filteredProblems = problems?.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </div>
                <QuestionTable filteredProblems={filteredProblems} />
            </div>
        </ReduxProvider>
    )
}