'use client'

import TestSetupAndPayment from '@/app/test-registration/test-reg'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'


const TestRegistration = () => {
  return (
    <ReduxProvider>
      <main className='dark'>
        <TestSetupAndPayment />
      </main>
    </ReduxProvider>
  )
}

export default TestRegistration