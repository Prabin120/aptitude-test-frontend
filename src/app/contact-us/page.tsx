'use client'
import ReduxProvider from '@/redux/redux-provider'
import ContactPage from '@/app/contact-us/contact'

const page = () => {
    return (
        <ReduxProvider>
            <main className='dark'>
                <ContactPage />
            </main>
        </ReduxProvider>
    )
}

export default page;