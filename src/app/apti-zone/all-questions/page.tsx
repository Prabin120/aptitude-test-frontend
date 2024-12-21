"use client"

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import ProblemListPage from './mainPage'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useSearchParams } from 'next/navigation'

const AllQuestionsPage = (context: Readonly<{ params: Params }>) => {
    const { type, tag } = context.params
    const searchParams = useSearchParams()
    const search = searchParams.get("search")??""
    return (
        <ReduxProvider>
            <ProblemListPage type={type} tag={tag} search={search} />
        </ReduxProvider>
    )
}

export default AllQuestionsPage