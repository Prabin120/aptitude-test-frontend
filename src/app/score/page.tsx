'use client'
import ScoreCard from '@/app/score/scoreCard'
import Header from '@/components/header'
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