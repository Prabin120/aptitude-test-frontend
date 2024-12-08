'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionTagCreationPage from './addTags'

export default function AddTags(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionTagCreationPage/>
            </main>
        </ReduxProvider>
    )
}