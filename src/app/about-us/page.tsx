'use client'
import ReduxProvider from '@/redux/redux-provider'
import AboutUsPage from '@/app/about-us/about'

export default function AboutUs() {
    return (
        <ReduxProvider>
            <AboutUsPage />
        </ReduxProvider>
    )
}