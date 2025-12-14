'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BlogEditor from '../add-blog/addBlog'
import ReduxProvider from '@/redux/redux-provider'
import { handleGetMethod } from '@/utils/apiCall'
import { getAdminBlogEndpoint } from '@/consts'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { withCreatorAccess } from '@/components/withCreatorAccess'


interface BlogPost {
    _id: string
    slug: string
    title: string
    author: string
    category: "Tutorial" | "Guide"
    tags: string[]
    featured: boolean
    content: string
    status: "draft" | "published"
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
}

function EditBlogPage() {
    const params = useParams()
    const router = useRouter()
    const [blog, setBlog] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params.slug) return

            try {
                const response = await handleGetMethod(`${getAdminBlogEndpoint}/${params.slug}`)
                if (response instanceof Response && response.ok) {
                    const data = await response.json()
                    setBlog(data.data)
                } else {
                    toast.error("Blog not found")
                    router.push('/admin/blogs')
                }
            } catch (error) {
                console.error(error)
                toast.error("Error fetching blog")
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [params.slug, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!blog) {
        return null // Should redirect in useEffect
    }

    return (
        <BlogEditor initialData={blog} isEditMode={true} />
    )
}



function EditBlog() {
    return (
        <ReduxProvider>
            <EditBlogPage />
        </ReduxProvider>
    )
}

export default withCreatorAccess(EditBlog);
