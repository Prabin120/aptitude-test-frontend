'use client'

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import QuestionsList from './questionsList'

const Test = ({ params }: { params: { type: string, slug: string } }) => {
    return (
        <ReduxProvider>
            <QuestionsList type={params.type} slug={params.slug} />
        </ReduxProvider>
    )
}

export default Test