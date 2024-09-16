'use client'
import ThankYouPage from '@/components/component/thankYou'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const ThankYou = () => {
  return (
    <ReduxProvider>
    <Header/>
    <div className='dark'>
    <ThankYouPage/>
    </div>
    </ReduxProvider>
  )
}

export default ThankYou