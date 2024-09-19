'use client'
import ThankYouPage from '@/components/component/thankYou'
import Header from '@/components/component/header'
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