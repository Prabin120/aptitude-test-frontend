"use client"

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import ProblemListPage from './mainPage'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

const AllQuestionsPage = (context: Readonly<{ params: Params }>) => {
    const { type, tag } = context.params
    return (
        <ReduxProvider>
            <ProblemListPage type={type} tag={tag} />
        </ReduxProvider>
    )
}

export default AllQuestionsPage