'use client'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import TestsPage from './createTest'
import Footer from '@/components/ui/footer'

function CreateTests() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <TestsPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}
export default CreateTests
