"use client"

import QuestionTable from "./table"
import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import Header from "@/components/component/header"
import ReduxProvider from "@/redux/redux-provider"
import { getAllQuestions } from "../apiCalls"

export default function ProblemListPage() {
    const [problems, setProblems] = useState<Problem[]>()
    const [searchQuery, setSearchQuery] = useState("")
    useEffect(()=>{
        (async()=>{
            const data = await getAllQuestions()
            setProblems(data)
        })()
    },[])
    const filteredProblems = problems?.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <Header />
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    </div>
                </div>
                <QuestionTable filteredProblems={filteredProblems} />
            </div>
        </ReduxProvider>
    )
}