'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Tag, Calendar } from "lucide-react"
import Link from "next/link"
import { handleGetMethod } from "@/utils/apiCall"
import { getBlogEndpoint } from "@/consts"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
    _id: string
    slug: string
    title: string
    author: string
    content: string
    category: string
    tags: string[]
    featured: boolean
    publishedAt: string
    createdAt: string
}

export default function BlogPage() {
    const params = useParams()
    const slug = params.slug as string

    const [blog, setBlog] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return

            try {
                const response = await handleGetMethod(`${getBlogEndpoint}/${slug}`)
                if (response instanceof Response) {
                    if (response.ok) {
                        const data = await response.json()
                        setBlog(data.data)
                    } else if (response.status === 404) {
                        setError('Blog post not found')
                    } else {
                        setError('Failed to load blog post')
                    }
                }
            } catch (err) {
                console.error('Error fetching blog:', err)
                setError('Failed to load blog post')
            } finally {
                setLoading(false)
            }
        }
        fetchBlog()
    }, [slug])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
                <div className="container mx-auto py-8 px-4 max-w-4xl">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-6 w-64 mb-8" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
                <div className="container mx-auto py-16 px-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {error || 'Blog not found'}
                    </h1>
                    <p className="text-zinc-400 mb-8">
                        The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all blogs
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
            {/* Back Link */}
            <div className="container mx-auto pt-8 px-4 max-w-4xl">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to blogs
                </Link>
            </div>

            {/* Header */}
            <header className="container mx-auto px-4 pb-8 max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-primary border-primary/50">
                        {blog.category}
                    </Badge>
                    {blog.featured && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                            Featured
                        </Badge>
                    )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                    {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                    <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {blog.author}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.publishedAt)}
                    </span>
                </div>

                {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                        {blog.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </header>

            {/* Content */}
            <article className="container mx-auto px-4 pb-16 max-w-4xl">
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6 md:p-10">
                        <div
                            className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-zinc-300 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary
                prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
                prose-ul:text-zinc-300 prose-ol:text-zinc-300
                prose-li:marker:text-primary
                prose-blockquote:border-primary prose-blockquote:text-zinc-400
                prose-img:rounded-lg prose-img:border prose-img:border-zinc-800
                prose-hr:border-zinc-700"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </CardContent>
                </Card>
            </article>

            {/* Footer CTA */}
            <div className="container mx-auto px-4 pb-16 max-w-4xl">
                <Card className="bg-gradient-to-r from-primary/30 to-blue-900/30 border-primary/50">
                    <CardContent className="py-8 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Enjoyed this post?</h2>
                        <p className="text-zinc-400 mb-4">Check out more tutorials and guides</p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-text px-6 py-2 rounded-lg transition-colors"
                        >
                            Browse all posts
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
