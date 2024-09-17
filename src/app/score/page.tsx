'use client'
import ScoreCard from '@/components/component/scoreCard'
import Header from '@/components/component/header'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const Score = () => {
  return (
    <ReduxProvider>
        <div className='dark'>
            <Header/>
            <ScoreCard/>
        </div>
    </ReduxProvider>
  )
}

export default Score