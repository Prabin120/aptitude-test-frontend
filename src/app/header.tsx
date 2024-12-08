"use client"
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

function MainHeader() {
  return (
    <ReduxProvider>
        <Header/>
    </ReduxProvider>
  )
}

export default MainHeader;