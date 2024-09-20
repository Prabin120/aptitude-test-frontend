'use client'
import Footer from '@/components/ui/footer'
import Header from '@/components/component/header'
import ReduxProvider from '@/redux/redux-provider'
import AboutUsPage from '@/components/component/about'

const page = () => {
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <AboutUsPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}

export default page;