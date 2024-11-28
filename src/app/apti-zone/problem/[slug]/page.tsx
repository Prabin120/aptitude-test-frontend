'use client'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import AptitudeQuestionPage from './question'

export default function AboutUs(context: Readonly<{ params: { slug: string }}>){
    const { slug } = context.params
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <AptitudeQuestionPage slug={slug}/>
            </main>
        </ReduxProvider>
    )
}