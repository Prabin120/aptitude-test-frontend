"use client"

import Header from '@/components/header'
import React from 'react'
import AptitudeListingPage from './apti'
import ReduxProvider from '@/redux/redux-provider'
import Footer from '@/components/ui/footer'

const AptiZone = () => {
  return (
    <ReduxProvider>
        <Header/>
        <AptitudeListingPage/>
        <Footer/>
    </ReduxProvider>
  )
}

export default AptiZone