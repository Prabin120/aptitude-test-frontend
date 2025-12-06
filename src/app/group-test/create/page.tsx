'use client'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import CreateTestsPage from './creatTest'

export default function TestList() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <CreateTestsPage />
            </main>
        </ReduxProvider>
    )
}