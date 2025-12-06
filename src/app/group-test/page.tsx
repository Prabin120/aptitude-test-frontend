'use client'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import GroupTests from './registeredTests'

export default function TestList() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <GroupTests />
            </main>
        </ReduxProvider>
    )
}