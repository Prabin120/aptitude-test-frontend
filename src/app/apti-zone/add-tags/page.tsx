'use client'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import QuestionTagCreationPage from './addTags'

export default function AddTags(){
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <QuestionTagCreationPage/>
            </main>
        </ReduxProvider>
    )
}