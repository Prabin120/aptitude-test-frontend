'use client'

import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Tag, Share2, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { BlogPost } from "@/app/admin/blogs/[slug]/page"

interface BlogClientProps {
    blog: BlogPost | null
    error?: string
}

export default function BlogClient({ blog, error }: BlogClientProps) {
    if (error || !blog) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="container mx-auto py-16 px-6 text-center">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                        <BookOpen className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {error || 'Blog not found'}
                    </h1>
                    <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                        The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to all blogs
                    </Link>
                </div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Minimal Sticky Nav for Reading Progress etc (Optional) */}

            <div className="container mx-auto px-6 max-w-4xl py-12 md:py-16">
                {/* Back Link */}
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to insights</span>
                </Link>

                {/* Article Header */}
                <header>
                    <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-2.5 py-0.5">
                            {blog.category}
                        </Badge>
                        {blog.featured && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                <Sparkles className="w-3 h-3 mr-1" /> Featured
                            </Badge>
                        )}
                        <span className="text-zinc-600 text-xs">•</span>
                        <span className="text-zinc-500 text-sm">{formatDate(blog.createdAt)}</span>
                    </div>

                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-zinc-900 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                                <User className="w-5 h-5 opacity-60" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-200">{blog.author}</p>
                                <p className="text-xs text-zinc-500">AptiCode Contributor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="relative">
                    <article className="prose prose-lg prose-invert max-w-none
                        prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-8
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white
                        prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#09090b] prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
                        prose-ul:text-zinc-300 prose-ol:text-zinc-300
                        prose-li:marker:text-primary
                        prose-blockquote:border-primary/50 prose-blockquote:bg-zinc-900/40 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-zinc-400 prose-blockquote:italic
                        prose-img:rounded-2xl prose-img:border prose-img:border-zinc-800 prose-img:shadow-2xl
                        prose-hr:border-zinc-900"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags at bottom of article */}
                    {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-16 pt-8 border-t border-zinc-900">
                            {blog.tags.map(tag => (
                                <Link
                                    key={tag}
                                    href={`/blogs?q=${tag}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-all font-medium"
                                >
                                    <Tag className="w-3 h-3 opacity-50" />
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / CTA Area */}
                <div className="mt-24 pt-16 border-t border-zinc-900">
                    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />

                        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Continue your preparation</h2>
                        <p className="text-zinc-400 mb-10 max-w-md mx-auto relative z-10">
                            Explore more technical guides, or dive into our compiler to practice your skills.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link
                                href="/blogs"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-zinc-700"
                            >
                                <BookOpen className="w-4 h-4" /> More Articles
                            </Link>
                            <Link
                                href="/online-compiler"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-text px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/10"
                            >
                                Practice Coding
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reading progress/Social bars could go here */}
        </div>
    )
}
