"use client"
import React from 'react'
import CodingPlatformPage from './mainPage'
import ReduxProvider from '@/redux/redux-provider'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useSearchParams } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

export default function CodePlatform(context: Readonly<{ params: Params }>) {
    const { slug, type } = context.params;
    const searchParams = useSearchParams()
    const time = searchParams.get("time") ?? "20000"

    return (
        <ReduxProvider>
            <QueryClientProvider client={queryClient}>
                <CodingPlatformPage slug={slug} type={type} time={time} />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ReduxProvider>
    )
}
