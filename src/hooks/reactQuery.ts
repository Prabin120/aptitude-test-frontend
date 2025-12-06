import { useQuery } from '@tanstack/react-query'
import { getTestsEndpoint, groupTestSingle, validAdminAccess, validCreatorAccess } from '@/consts'
import { handleGetMethod } from '@/utils/apiCall'
import { getAllQuestions, getQuestionBySlug } from '@/app/code/apiCalls'
import { IAptiQuestion, ICodingQuestion } from '@/app/group-test/[testId]/questionsList'

interface ExamQuestionsResponse {
    data:{
        _id: string
        apti_list: IAptiQuestion[]
        code_list: ICodingQuestion[]
        endDateTime: string
    }
}

const fetchExamQuestions = async (slug: string): Promise<ExamQuestionsResponse> => {
    const response = await handleGetMethod(slug)
    if (response instanceof Response) {
        const res = await response.json()
        return res
    }
    throw new Error('Unexpected response type')
}

export const useExamQuestions = (slug: string) => {
    return useQuery({
        queryKey: ['examQuestions', slug],
        queryFn: () => fetchExamQuestions(`${getTestsEndpoint}/${slug}`),
        staleTime: 3600000, // 1 minute
        gcTime: 10800000, // 1 hour (formerly cacheTime)
        retry: 2,
        enabled: !!slug,
    })
}
export const useGroupTestQuestions = (testId: string) => {
    return useQuery({
        queryKey: ['examQuestions', testId],
        queryFn: () => fetchExamQuestions(`${groupTestSingle}/${testId}`),
        staleTime: 3600000, // 1 minute
        gcTime: 10800000, // 1 hour (formerly cacheTime)
        retry: 2,
        enabled: !!testId,
    })
}
const checkAdminAccess = async () => {
    const response = await handleGetMethod(validAdminAccess)
    if (response.status === 200){
        return true
    }
    return false
}

const checkCreatorAccess = async () => {
    const response = await handleGetMethod(validCreatorAccess)
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

export const useCheckCreatorAccess = () => {
    return useQuery({
        queryKey: ['checkCreatorAccess'],
        queryFn: () => checkCreatorAccess(),
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
