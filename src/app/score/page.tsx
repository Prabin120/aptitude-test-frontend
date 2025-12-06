'use client'
import ScoreCard from '@/app/score/scoreCard'
import ReduxProvider from '@/redux/redux-provider'
import React from 'react'

const Score = () => {
  return (
    <ReduxProvider>
        <div className='dark'>
            <ScoreCard/>
        </div>
    </ReduxProvider>
  )
}

export default Score