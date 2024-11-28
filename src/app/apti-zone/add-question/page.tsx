'use client'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import QuestionCreationPage from './addQuestion'

export default function AddAptiQuestion(){
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <QuestionCreationPage />
            </main>
        </ReduxProvider>
    )
}