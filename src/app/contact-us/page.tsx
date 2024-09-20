'use client'
import Footer from '@/components/ui/footer'
import Header from '@/components/component/header'
import ReduxProvider from '@/redux/redux-provider'
import ContactPage from '@/components/component/contact'

const page = () => {
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <ContactPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}

export default page;