'use client'
import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import QuestionsList from './questionsList';
import ReduxProvider from '@/redux/redux-provider';

const queryClient = new QueryClient();

function GroupTest({ params }: { params: { testId: string } }) {
    return (
        <ReduxProvider>
            <QueryClientProvider client={queryClient}>
                <QuestionsList testIdn={params.testId} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ReduxProvider>
    )
}

export default GroupTest
