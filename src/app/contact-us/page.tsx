'use client'
import Footer from '@/components/ui/footer'
import ReduxProvider from '@/redux/redux-provider'
import ContactPage from '@/app/contact-us/contact'

const page = () => {
    return (
        <ReduxProvider>
            <main className='dark'>
                <ContactPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}

export default page;