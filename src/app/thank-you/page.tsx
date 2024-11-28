'use client'
import ThankYouPage from '@/app/thank-you/thankYou'
import Header from '@/components/header'
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