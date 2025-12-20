import React from 'react'
export const dynamic = 'force-dynamic'
import QuestionTypeClient from './QuestionTypeClient'
import { apiEntryPoint, getAptiQuestionByTypeTagEndpoint } from '@/consts'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
    const { type } = params
    return {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} | Aptitude | AptiCode`,
        description: `Browse aptitude questions by ${type}.`
    }
}

async function getQuestionsByType(type: string, search: string) {
    try {
        const endpoint = getAptiQuestionByTypeTagEndpoint(type)
        const res = await fetch(`${apiEntryPoint}${endpoint}?search=${search}`, { next: { revalidate: 3600 } })
        if (!res.ok) return []
        const data = await res.json()
        return data.questions || []
    } catch (e) {
        console.error("Error fetching questions by type", e)
        return []
    }
}

export default async function QuestionTypePage({ params, searchParams }: { params: { type: string }, searchParams: { search?: string } }) {
    const { type } = params
    const search = searchParams.search ?? ""
    const questions = await getQuestionsByType(type, search)

    return (
        <QuestionTypeClient
            type={type}
            initialQuestions={questions}
            initialSearch={search}
        />
    )
}