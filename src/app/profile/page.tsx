'use client'
import UserProfile from '@/app/profile/profile'
import Footer from '@/components/ui/footer'
import ReduxProvider from '@/redux/redux-provider'

const page = () => {
    return (
        <ReduxProvider>
            <main className='dark'>
                <UserProfile />
            </main>
            <Footer />
        </ReduxProvider>
    )
}

export default page;