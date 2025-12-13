'use client'

import ReduxProvider from '@/redux/redux-provider'
import AdminBlogsPage from './listBlogs'

export default function AdminBlogsWrapper() {
    return (
        <ReduxProvider>
            <AdminBlogsPage />
        </ReduxProvider>
    )
}
