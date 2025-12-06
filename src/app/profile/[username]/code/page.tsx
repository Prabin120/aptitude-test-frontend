"use client";

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import Profile from './codeProfile'

function CodeProfile() {
  return (
    <ReduxProvider>
        <main className='dark'>
            <Profile />
        </main>
    </ReduxProvider>
  )
}

export default CodeProfile
