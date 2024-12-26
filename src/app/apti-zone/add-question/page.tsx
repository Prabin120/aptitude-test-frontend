'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionCreationPage from './addQuestion'
import { withAdminAuth } from '@/components/withAdminAuth'

function AddAptiQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionCreationPage />
            </main>
        </ReduxProvider>
    )
}

export default withAdminAuth(AddAptiQuestion)