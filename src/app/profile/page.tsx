'use client'
import UserProfile from '@/components/component/profile'
import Footer from '@/components/ui/footer'
import Header from '@/components/ui/header'
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