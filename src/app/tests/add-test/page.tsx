'use client'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import TestsPage from './createTest'

function CreateTests() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <TestsPage />
            </main>
        </ReduxProvider>
    )
}
export default CreateTests
