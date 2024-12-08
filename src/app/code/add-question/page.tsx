'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionSubmissionForm from './addQuestion'

export default function AboutUs(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionSubmissionForm />
            </main>
        </ReduxProvider>
    )
}