'use client'
import Footer from '@/components/ui/footer'
import ReduxProvider from '@/redux/redux-provider'
import ExamScore from './scorePage'

export default function ScorePage({ params }: { params: { type: string, slug: string } }) {
    return (
        <ReduxProvider>
            <main className='dark'>
                <ExamScore slug={params.slug} />
            </main>
            <Footer />
        </ReduxProvider>
    )
}