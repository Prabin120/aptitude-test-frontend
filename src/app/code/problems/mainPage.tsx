"use client"

import QuestionTable from "./table"
import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { Problem } from "../commonInterface"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetAllQuestions } from "@/hooks/reactQuery"
export interface ICodingFilters {
    title: string
    difficulty: string
    status: string
}

export default function ProblemListPage() {
    const router = useRouter()
    const searchP = useSearchParams()
    const [problems, setProblems] = useState<Problem[]>()
    const [searchQuery, setSearchQuery] = useState<ICodingFilters>({ title: "", difficulty: "", status: "" })
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    // Update `search` whenever `searchP` changes
    useEffect(() => {
        const queryParams = searchP.toString(); // Convert searchP to a query string
        setSearch(queryParams);
    }, [searchP]);
    const { data, isLoading, isError } = useGetAllQuestions(search);
    useEffect(() => {
        if (isLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
        if (data) {
            setProblems(data.questions || []);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.currentPage || 1);
        }
        if (isError) {
            setLoading(false);
            alert("Error fetching problems");
        }
    }, [data, isLoading, isError]);

    const filteredProblems = () => {
        let searchParams = "?";
        if (["medium", "easy", "hard"].includes(searchQuery.difficulty)) {
            searchParams += `&difficulty=${searchQuery.difficulty}`
        }
        if (["solved", "attempted"].includes(searchQuery.status)) {
            searchParams += `&status=${searchQuery.status}`
        }
        if (searchQuery.title) {
            searchParams += `&search=${searchQuery.title}`
        }
        setSearch(searchParams)
        router.replace("/code/problems" + searchParams)
    }

    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredProblems={filteredProblems} />
                    </div>
                </div>
                {loading ? <div className="h-[80vh] flex items-center justify-center">Loading...</div>
                    :
                    <QuestionTable filteredProblems={problems} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                }
            </div>
        </ReduxProvider>
    )
}