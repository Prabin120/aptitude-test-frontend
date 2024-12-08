'use client'
import Footer from '@/components/ui/footer'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import AptitudeListingPage from './testList'

export default function TestList() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <AptitudeListingPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}