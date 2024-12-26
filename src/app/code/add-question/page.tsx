'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionSubmissionForm from './addQuestion'
import { withAdminAuth } from '@/components/withAdminAuth'

function AddQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionSubmissionForm />
            </main>
        </ReduxProvider>
    )
}

export default withAdminAuth(AddQuestion);