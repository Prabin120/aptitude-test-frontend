'use client'
import Footer from '@/components/ui/footer'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'
import AboutUsPage from '@/app/about-us/about'

export default function AboutUs() {
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