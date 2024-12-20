'use client'

import ReduxProvider from '@/redux/redux-provider'
import React from 'react'
import TestPage from './test'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { useSearchParams } from 'next/navigation'

const Test = ({ params }: { params: Params }) => {
    const { type, tag } = params
    const searchParams = useSearchParams()
    const time = searchParams.get("time") ?? "20000"
    return (
        <ReduxProvider>
            <div className='dark'>
                <TestPage type={type} tag={tag} time={time} />
            </div>
        </ReduxProvider>
    )
}

export default Test