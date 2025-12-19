import React from 'react'
import AllQuestionsClient from './AllQuestionsClient'
import { Metadata } from 'next'
import { apiEntryPoint, getAllAptiQuestionsEndpoint } from '@/consts'

export const metadata: Metadata = {
    title: "All Questions | AptiCode",
    description: "Practice all aptitude questions on AptiCode."
}

// Server-side fetching
async function getQuestions(page: number, search: string) {
    try {
        const res = await fetch(`${apiEntryPoint}${getAllAptiQuestionsEndpoint}?page=${page}&search=${search}`, { next: { revalidate: 3600 } })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        console.error("Error fetching questions", e)
        return null
    }
}

export default async function AllQuestionsPage({ searchParams }: { searchParams: { page?: string, search?: string } }) {
    const page = Number(searchParams.page) || 1
    const search = searchParams.search ?? ""

    const data = await getQuestions(page, search)

    return (
        <AllQuestionsClient
            initialProblems={data?.data}
            initialTotalPages={data?.totalPages}
            initialSearch={search}
        />
    )
}