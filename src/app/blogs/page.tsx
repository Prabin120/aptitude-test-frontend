'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, Clock, User, Tag } from "lucide-react"
import Link from "next/link"
import { handleGetMethod } from "@/utils/apiCall"
import { getBlogsEndpoint } from "@/consts"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
    _id: string
    slug: string
    title: string
    author: string
    category: string
    tags: string[]
    featured: boolean
    publishedAt: string
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await handleGetMethod(getBlogsEndpoint)
                if (response instanceof Response && response.ok) {
                    const data = await response.json()
                    setBlogs(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching blogs:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const featuredBlogs = blogs.filter(b => b.featured)
    const regularBlogs = blogs.filter(b => !b.featured)

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
                <div className="container mx-auto py-16 px-4">
                    <Skeleton className="h-12 w-64 mb-4" />
                    <Skeleton className="h-6 w-96 mb-12" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-blue-900/20" />
                <div className="container mx-auto py-16 px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        AptiCode Blog
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl">
                        Tutorials, guides, and tips to help you make the most of AptiCode&apos;s features.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                {/* Featured Posts */}
                {featuredBlogs.length > 0 && (
                    <>
                        {featuredBlogs.map((post) => (
                            <Link href={`/blogs/${post.slug}`} key={post._id} className="block mb-8">
                                <Card className="bg-gradient-to-r from-primary/30 to-blue-900/30 border-primary/50 hover:border-primary/70 transition-all group">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Featured
                                            </Badge>
                                            <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                                                {post.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl md:text-3xl text-white group-hover:text-primary transition-colors">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-zinc-500 text-sm mb-4">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {post.author}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(post.publishedAt)}
                                            </span>
                                        </div>
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.slice(0, 5).map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-zinc-500 border-zinc-700">
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                                            Read article
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </>
                )}

                {/* All Posts */}
                {regularBlogs.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6">All Posts</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {regularBlogs.map((post) => (
                                <Link href={`/blogs/${post.slug}`} key={post._id}>
                                    <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 transition-all h-full group">
                                        <CardHeader>
                                            <Badge variant="outline" className="w-fit text-zinc-400 border-zinc-700 mb-2">
                                                {post.category}
                                            </Badge>
                                            <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                                                {post.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-zinc-500 text-sm mb-3">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {post.author}
                                                </span>
                                                <span>{formatDate(post.publishedAt)}</span>
                                            </div>
                                            {post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {post.tags.slice(0, 3).map(tag => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {blogs.length === 0 && (
                    <Card className="bg-zinc-900/30 border-zinc-800 border-dashed">
                        <CardContent className="py-12 text-center">
                            <p className="text-zinc-500 text-lg">No blog posts yet. Check back soon!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
