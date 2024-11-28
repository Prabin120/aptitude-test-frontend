"use client"

import ReduxProvider from '@/redux/redux-provider'
import dynamic from 'next/dynamic'

const TestCaseSubmissionPage = dynamic(() => import('./addTestcase'), { ssr: false })

export default function Page() {
  return (
    <ReduxProvider>
        <TestCaseSubmissionPage />
    </ReduxProvider>
  )
}