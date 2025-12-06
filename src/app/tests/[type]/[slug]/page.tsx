'use client'

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import QuestionsList from './questionsList'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const Test = ({ params }: { params: { type: string, slug: string } }) => {
    return (
        <ReduxProvider>
            <QueryClientProvider client={queryClient}>
                <QuestionsList type={params.type} slug={params.slug} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ReduxProvider>
    )
}

export default Test