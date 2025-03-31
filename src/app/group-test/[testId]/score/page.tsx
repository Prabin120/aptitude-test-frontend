'use client'

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import ExamScore from './scorePage'

function GroupTestScore({params}: { params: { testId: string } }) {
    return (
        <ReduxProvider>
            <main className='dark'>
                <ExamScore testId={params.testId} />
            </main>
        </ReduxProvider>
    )
}

export default GroupTestScore
