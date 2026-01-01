'use client'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import AptitudeListingPage from './testList'

export default function TestList() {
    return (
        <ReduxProvider>
            <main className='dark min-h-[75vh]'>
                <AptitudeListingPage />
            </main>
        </ReduxProvider>
    )
}