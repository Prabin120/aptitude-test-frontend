'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionCreationPage from './addQuestion'
import { withCreatorAccess } from '@/components/withCreatorAccess'

function AddAptiQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionCreationPage />
            </main>
        </ReduxProvider>
    )
}

export default withCreatorAccess(AddAptiQuestion)