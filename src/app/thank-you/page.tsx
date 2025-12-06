'use client'
import ThankYouPage from '@/app/thank-you/thankYou'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const ThankYou = () => {
  return (
    <ReduxProvider>
      <div className='dark'>
        <ThankYouPage />
      </div>
    </ReduxProvider>
  )
}

export default ThankYou