'use client'
import ReduxProvider from '@/redux/redux-provider'
import QuestionTagCreationPage from './addTags'
import { withAdminAuth } from '@/components/withAdminAuth'

function AddTags(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <QuestionTagCreationPage/>
            </main>
        </ReduxProvider>
    )
}

export default withAdminAuth(AddTags)