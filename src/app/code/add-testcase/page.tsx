"use client"

import { withAdminAuth } from '@/components/withAdminAuth'
import ReduxProvider from '@/redux/redux-provider'
import dynamic from 'next/dynamic'

const TestCaseSubmissionPage = dynamic(() => import('./addTestcase'), { ssr: false })

function AddTestCase() {
  return (
    <ReduxProvider>
        <TestCaseSubmissionPage />
    </ReduxProvider>
  )
}

export default withAdminAuth(AddTestCase);