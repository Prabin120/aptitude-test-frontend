import { useQuery } from '@tanstack/react-query'
import { getTestsEndpoint } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import { IAptiQuestion, ICodingQuestion } from '@/app/tests/[type]/[slug]/questionsList'

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


