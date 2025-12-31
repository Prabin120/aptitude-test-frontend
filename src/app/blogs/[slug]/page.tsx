import { Metadata } from 'next'
import BlogClient from './BlogClient'
import { getBlogEndpoint, apiEntryPoint } from '@/consts'
import { BlogPost } from '@/app/admin/blogs/[slug]/page'

async function getBlog(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${apiEntryPoint}${getBlogEndpoint}/${slug}`, { next: { revalidate: 3600 } })
        if (!res.ok) return null
        const data = await res.json()
        return data.data
    } catch (e) {
        console.error("Error fetching blog", e)
        return null
    }
}

export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const blog = await getBlog(params.slug)

    if (!blog) {
        return {
            title: 'Blog Not Found | AptiCode'
        }
    }

    // Strip HTML tags for description
    const description = blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...'

    return {
        title: `${blog.title} | AptiCode Blog`,
        description: description,
        openGraph: {
            title: blog.title,
            description: description,
            type: 'article',
            authors: [blog.author],
            publishedTime: blog.publishedAt,
            tags: blog.tags
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: description,
            creator: "@apticode",
        },
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const blog = await getBlog(params.slug)

    if (!blog) {
        return <BlogClient blog={null} error="Blog post not found" />
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        datePublished: blog.publishedAt,
        author: [{
            '@type': 'Person',
            name: blog.author,
        }]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogClient blog={blog} />
        </>
    )
}
