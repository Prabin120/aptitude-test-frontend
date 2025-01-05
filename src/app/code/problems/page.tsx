"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ProblemListPage from './mainPage';

const queryClient = new QueryClient();

function CodeProblemsPage() {
  return (
    <QueryClientProvider client={queryClient}>
        <ProblemListPage/>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default CodeProblemsPage