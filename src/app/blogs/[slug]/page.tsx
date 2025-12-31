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

    // Extract first image from content
    const imageRegex = /<img [^>]*src="([^"]+)"[^>]*>/;
    const match = blog.content.match(imageRegex);
    const imageUrl = match ? match[1] : "/og-image.png";

    const keywords = [...(blog.tags || []), blog.category, "AptiCode Blog", "Coding Tutorials"].join(", ")

    return {
        title: `${blog.title} | AptiCode Blog`,
        description: description,
        keywords: keywords,
        category: blog.category,
        authors: [{ name: blog.author }],
        openGraph: {
            title: blog.title,
            description: description,
            type: 'article',
            authors: [blog.author],
            publishedTime: blog.publishedAt,
            tags: blog.tags,
            images: [
                {
                    url: imageUrl,
                    alt: blog.title
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: description,
            creator: "@apticode",
            images: [imageUrl],
        },
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const blog = await getBlog(params.slug)

    if (!blog) {
        return <BlogClient blog={null} error="Blog post not found" />
    }

    // Extract first image for JSON-LD
    const imageRegex = /<img [^>]*src="([^"]+)"[^>]*>/;
    const match = blog.content.match(imageRegex);
    const imageUrl = match ? match[1] : "https://apticode.in/og-image.png";

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
        image: imageUrl.startsWith('data:') ? 'https://apticode.in/og-image.png' : imageUrl,
        datePublished: blog.publishedAt,
        dateModified: (blog as any).updatedAt || blog.publishedAt,
        author: [{
            '@type': 'Person',
            name: blog.author,
            url: `https://apticode.in`
        }],
        publisher: {
            '@type': 'Organization',
            name: 'AptiCode',
            logo: {
                '@type': 'ImageObject',
                url: 'https://apticode.in/og-image.png'
            }
        },
        keywords: (blog.tags || []).join(", "),
        articleSection: blog.category
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
