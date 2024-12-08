'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionCreationPage from './addQuestion'

export default function AddAptiQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionCreationPage />
            </main>
        </ReduxProvider>
    )
}