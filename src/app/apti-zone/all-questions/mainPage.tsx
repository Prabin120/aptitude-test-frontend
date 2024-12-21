"use client"

import { useEffect, useState } from "react"
import QuestionsFilters from "./filters"
import ReduxProvider from "@/redux/redux-provider"
import { FilterQuestionProps, Problem } from "../commonInterface"
import { getAllAptiQuestions } from "../apicalls"
import QuestionTable from "./table"
import { checkAuthorization } from "@/utils/authorization"
import { useAppDispatch } from "@/redux/store"

export default function ProblemListPage({type, tag}: Readonly<{ type: string, tag: string }>) {
    const [problems, setProblems] = useState<Problem[]>()
    const [searchQuery, setSearchQuery] = useState<FilterQuestionProps>({ title: "", type: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const dispatch = useAppDispatch();
    const errorDetect = (error: string) => {
        return error ?(
            <div className="text-red-500">{error}</div>
        ) : (
            <QuestionTable data={problems} currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )
    }
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(""); // Reset error state before fetching
            try {
                const response = await getAllAptiQuestions(page, 10);
                await checkAuthorization(response, dispatch);
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

    const handleSearchButton = (title: string) => {
        setSearchQuery({ ...searchQuery, title });
        console.log(searchQuery);
    }

    return (
        <ReduxProvider>
            <div className="container mx-auto">
                <div className="sticky top-0 bg-neutral-950 z-50">
                    <div className="pt-3">
                        <QuestionsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchButton={handleSearchButton} />
                    </div>
                </div>
                {loading ?
                    <div>Loading questions...</div> : 
                    errorDetect(error)
                } 
                
            </div>
        </ReduxProvider>
    )
}