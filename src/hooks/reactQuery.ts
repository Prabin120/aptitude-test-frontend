import { useQuery } from '@tanstack/react-query'
import { codeQuestions, getTestsEndpoint, validAdminAccess } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import { IAptiQuestion, ICodingQuestion } from '@/app/tests/[type]/[slug]/questionsList'
import { get } from 'lodash'
import { getAllQuestions, getQuestionBySlug } from '@/app/code/apiCalls'

interface ExamQuestionsResponse {
    test: {
        _id: string
        codingMarks: string
        aptiMarks: string
        endDateTime: string
    }
    codingQuestions: ICodingQuestion[]
    aptiQuestions: IAptiQuestion[]
}

const fetchExamQuestions = async (slug: string): Promise<ExamQuestionsResponse> => {
    const response = await handleGetMethod(`${getTestsEndpoint}/${slug}`)
    if (response instanceof Response) {
        const res = await response.json()
        return res
    }
    throw new Error('Unexpected response type')
}

export const useExamQuestions = (slug: string) => {
    return useQuery({
        queryKey: ['examQuestions', slug],
        queryFn: () => fetchExamQuestions(slug),
        staleTime: 3600000, // 1 minute
        gcTime: 10800000, // 1 hour (formerly cacheTime)
        retry: 2,
        enabled: !!slug,
    })
}
const checkAdminAccess = async () => {
    const response = await handleGetMethod(validAdminAccess)
    if (response.status === 200){
        return true
    }
    return false
}

export const useCheckAdminAccess = () => {
    return useQuery({
        queryKey: ['checkAdminAccess'],
        queryFn: () => checkAdminAccess(),
        staleTime: 3600000,
        gcTime: 3600000,
        retry: 2,
        enabled: true,
    })
}

export const useGetAllQuestions = (search: string) => {
    return useQuery({
        queryKey: ['codeQuestions', search],
        queryFn: () => getAllQuestions(search),
        staleTime: 3600000,
        gcTime: 3600000,
        retry: 2,
        enabled: true,
    })
}

export const useGetQuestionBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['singleCodeQuestions', slug],
        queryFn: () => getQuestionBySlug(slug),
        staleTime: 3600000,
        gcTime: 3600000,
        retry: 2,
        enabled: true,
    })
}
