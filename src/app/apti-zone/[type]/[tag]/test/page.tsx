'use client'

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import TestPage from './test'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

const Test = (context: { params: Params }) => {
  const { type, tag } = context.params
  return (
    <ReduxProvider>
      <div className='dark'>
        <TestPage type={type} tag={tag} />
      </div>
    </ReduxProvider>
  )
}

export default Test