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

import { getAptiQuestionTagEndpoint } from '@/consts'

async function getQuestionsByType(type: string, search: string) {
    try {
        const endpoint = getAptiQuestionByTypeTagEndpoint(type)
        const fetchUrl = `${apiEntryPoint}${endpoint}?search=${search}`
        console.log(`[ProdDebug] Fetching: ${fetchUrl}`)

        let res = await fetch(fetchUrl, { next: { revalidate: 3600 } })

        if (!res.ok) {
            console.warn(`[ProdDebug] Specific fetch failed (${res.status}). Trying fallback...`)
            // Fallback to main endpoint if specific endpoint is missing (404)
            const fallbackUrl = `${apiEntryPoint}${getAptiQuestionTagEndpoint}?search=${search}`
            res = await fetch(fallbackUrl, { cache: 'no-store' })
        }

        if (!res.ok) {
            console.error(`[ProdDebug] Fallback fetch also failed: ${res.status}`)
            return []
        }

        const data = await res.json()

        // Handle response from either endpoint
        let questions = []
        if (data.questions) {
            questions = data.questions
        } else if (type === 'topic' && data.topics) {
            questions = data.topics
        } else if (type === 'category' && data.categories) {
            questions = data.categories
        } else if (type === 'company' && data.companies) {
            questions = data.companies
        }

        console.log(`[ProdDebug] Fetched ${questions.length} items for ${type}`)
        return questions

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