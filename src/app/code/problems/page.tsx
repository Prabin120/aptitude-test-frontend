"use client"

import QuestionTable from "./table"
import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { getAllQuestions } from "../apiCalls"
import { Problem } from "../commonInterface"
import { useRouter, useSearchParams } from "next/navigation"
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
    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            setLoading(true);
            (async () => {
                try {
                    const data = await getAllQuestions(search);
                    setProblems(data.questions);
                    setTotalPages(data.totalCount)
                } catch (err) {
                    alert("Failed to load questions. Please try again.");
                } finally {
                    setLoading(false);
                }
            })();
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [searchP])

    const filteredProblems = () =>{
        let searchParams = "?";
        if(["medium", "easy", "hard"].includes(searchQuery.difficulty)){
            searchParams += `&difficulty=${searchQuery.difficulty}`
        }
        if(["solved", "attempted"].includes(searchQuery.status)){
            searchParams += `&status=${searchQuery.status}`
        }
        if(searchQuery.title){
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
                <QuestionTable filteredProblems={problems} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                }
            </div>
        </ReduxProvider>
    )
}