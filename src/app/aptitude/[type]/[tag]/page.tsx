import { Metadata } from 'next'
import ProblemListClient from './ProblemListClient'
import {
    apiEntryPoint,
    getAptiQuestionByTopicEndpoint,
    getAptiQuestionByCompanyEndpoint,
    getAptiQuestionByCategoryEndpoint,
    getTestsEndpoint,
} from '@/consts'

// Server-side fetching logic
async function getQuestions(type: string, tag: string, page: number = 1, limit: number = 10) {
    let endpoint = ''
    let query = `page=${page}&limit=${limit}`

    if (type === "topic") {
        endpoint = getAptiQuestionByTopicEndpoint + "/" + tag
    } else if (type === "company") {
        endpoint = getAptiQuestionByCompanyEndpoint + "/" + tag
    } else if (type === "category") {
        endpoint = getAptiQuestionByCategoryEndpoint + "/" + tag
    } else if (type === "exam") {
        endpoint = getTestsEndpoint + `/${tag}`
        query = `onlyApti=true`
    } else {
        return null
    }

    try {
        const res = await fetch(`${apiEntryPoint}${endpoint}?${query}`, { next: { revalidate: 3600 } })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        console.error("Error fetching questions", e)
        return null
    }
}

export async function generateMetadata({ params }: { params: { type: string, tag: string } }): Promise<Metadata> {
    const { type, tag } = params
    const decodedTag = decodeURIComponent(tag)
    const title = `${decodedTag} Questions | ${type.charAt(0).toUpperCase() + type.slice(1)} | AptiCode`

    return {
        title,
        description: `Practice ${decodedTag} questions for ${type} on AptiCode.`,
        openGraph: {
            title,
            description: `Practice ${decodedTag} questions for ${type} on AptiCode.`,
        }
    }
}

export default async function Page({ params, searchParams }: { params: { type: string, tag: string }, searchParams: { page?: string, limit?: string } }) {
    const { type, tag } = params
    const page = Number(searchParams.page) || 1
    const limit = Number(searchParams.limit) || 10
    const data = await getQuestions(type, tag, page, limit)

    return <ProblemListClient
        type={type}
        tag={tag}
        initialProblems={data?.data}
        initialTotalPages={data?.totalPages}
    />
}