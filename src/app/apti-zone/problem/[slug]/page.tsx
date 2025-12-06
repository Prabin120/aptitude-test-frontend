'use client'
import ReduxProvider from '@/redux/redux-provider'
import AptitudeQuestionPage from './question'

export default function AboutUs(context: Readonly<{ params: { slug: string }}>){
    const { slug } = context.params
    return (
        <ReduxProvider>
            <main className='dark'>
                <AptitudeQuestionPage slug={slug}/>
            </main>
        </ReduxProvider>
    )
}