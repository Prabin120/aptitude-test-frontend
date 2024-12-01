'use client'
import UserProfile from '@/app/profile/profile'
import Footer from '@/components/ui/footer'
import Header from '@/components/header'
import ReduxProvider from '@/redux/redux-provider'

const page = () => {
    return (
        <ReduxProvider>
            <Header />
            <main className='dark'>
                <UserProfile />
            </main>
            <Footer />
        </ReduxProvider>
    )
}

export default page;