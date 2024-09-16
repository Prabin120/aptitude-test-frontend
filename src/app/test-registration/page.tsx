'use client'

import TestSetupAndPayment from '@/components/component/test-reg'
import Header from '@/components/ui/header'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'


const TestRegistration = () => {
  return (
    <ReduxProvider>
      <main className='dark'>
        <Header />
        <div>
          <TestSetupAndPayment />
        </div>
      </main>
    </ReduxProvider>
  )
}

export default TestRegistration