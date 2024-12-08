"use client"
import React from 'react'
import CodingPlatformPage from './mainPage'
import ReduxProvider from '@/redux/redux-provider'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

export default function CodePlatform(context: Readonly<{ params: Params }>) {
    const { slug, type } = context.params;
    return (
        <ReduxProvider>
            <CodingPlatformPage slug={slug} type={type} />
        </ReduxProvider>
    )
}
