'use client'
import Footer from '@/components/ui/footer'
import ReduxProvider from '@/redux/redux-provider'
import AboutUsPage from '@/app/about-us/about'

export default function AboutUs() {
    return (
        <ReduxProvider>
            <main className='dark'>
                <AboutUsPage />
            </main>
            <Footer />
        </ReduxProvider>
    )
}