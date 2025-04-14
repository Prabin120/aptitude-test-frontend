'use client'
import ReduxProvider from '@/redux/redux-provider'
import { withAdminAuth } from '@/components/withAdminAuth'
import FormContainer from '../_components/form-container'

function AddQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <FormContainer/>
            </main>
        </ReduxProvider>
    )
}

export default withAdminAuth(AddQuestion);