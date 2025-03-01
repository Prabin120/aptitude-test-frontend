"use client"

import React from 'react'
import AptitudeListingPage from './apti'
import ReduxProvider from '@/redux/redux-provider'

const AptiZone = () => {
  return (
    <ReduxProvider>
        <AptitudeListingPage/>
    </ReduxProvider>
  )
}

export default AptiZone