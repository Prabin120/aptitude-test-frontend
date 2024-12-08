"use client"

import React from 'react'
import AptitudeListingPage from './apti'
import ReduxProvider from '@/redux/redux-provider'
import Footer from '@/components/ui/footer'

const AptiZone = () => {
  return (
    <ReduxProvider>
        <AptitudeListingPage/>
        <Footer/>
    </ReduxProvider>
  )
}

export default AptiZone