'use client'

import TestScreen from '@/components/component/test'
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