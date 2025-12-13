'use client'

import ReduxProvider from '@/redux/redux-provider'
import BlogEditor from './addBlog'

import { withCreatorAccess } from '@/components/withCreatorAccess'

function AddBlog() {
    return (
        <ReduxProvider>
            <BlogEditor />
        </ReduxProvider>
    )
}

export default withCreatorAccess(AddBlog);
