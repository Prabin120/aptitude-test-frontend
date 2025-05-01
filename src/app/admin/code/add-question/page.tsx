'use client'
import ReduxProvider from '@/redux/redux-provider'
import FormContainer from '../_components/form-container'
import { withCreatorAccess } from '@/components/withCreatorAccess'

function AddQuestion(){
    return (
        <ReduxProvider>
            <main className='dark'>
                <FormContainer/>
            </main>
        </ReduxProvider>
    )
}

export default withCreatorAccess(AddQuestion);