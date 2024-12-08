'use client'

import TestScreen from '@/app/tests/test/test'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const Test = () => {
  return (
    <ReduxProvider>
      <div className='dark'>
        <TestScreen />
      </div>
    </ReduxProvider>
  )
}

export default Test