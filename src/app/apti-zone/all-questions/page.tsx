"use client"

import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import Header from "@/components/header"
import ReduxProvider from "@/redux/redux-provider"
import { FilterQuestionProps, Problem } from "../commonInterface"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { getAllAptiQuestions } from "../apicalls"
import QuestionTable from "./table"

export default function ProblemListPage(context: Readonly<{ params: Params }>) {
    const [problems, setProblems] = useState<Problem[]>()
    const [searchQuery, setSearchQuery] = useState<FilterQuestionProps>({ title: "", type: "" })
    const { type, tag } = context.params
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(""); // Reset error state before fetching
            try {
                const response = await getAllAptiQuestions(page, 10);
                setTotalPages(response.totalPages);
                setProblems(response.data);
            } catch (err) {
                setError("Failed to load questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [page, type, tag]); // Add `page` to dependency array

    const filteredProblems = problems?.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.title.toLowerCase())
    )

    const handleSearchButton = (title: string) => {
        console.log(title);
    }
    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <Header />
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchButton={handleSearchButton} />
                    </div>
                </div>
                {loading ? (
                    <div>Loading questions...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <QuestionTable data={filteredProblems} currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
        </ReduxProvider>
    )
}