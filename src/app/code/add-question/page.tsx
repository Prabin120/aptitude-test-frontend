'use client'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import QuestionSubmissionForm from './addQuestion'

export default function AboutUs(){
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <QuestionSubmissionForm />
            </main>
        </ReduxProvider>
    )
}