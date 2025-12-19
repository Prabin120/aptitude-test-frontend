import { MetadataRoute } from 'next'
import { getBlogsEndpoint, getAptiQuestionTagEndpoint, apiEntryPoint, getAllAptiQuestionsEndpoint } from '@/consts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://apticode.in'

    const routes = [
        '',
        '/login',
        '/signup',
        '/forgot-password',
        '/coding/problems',
        '/online-compiler',
        '/aptitude',
        '/rewards',
        '/contribute',
        '/group-test',
        '/about-us',
        '/contact-us',
        '/terms-and-conditions',
        '/privacy-policy',
        '/shipping-policy',
        '/cancelation-and-refunds',
        '/admin',
    ]

    const compilerLanguages = [
        'python',
        'javascript',
        'java',
        'cpp',
        'c',
        'go',
    ]

    const staticPages = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }))

    const compilerPages = compilerLanguages.map((lang) => ({
        url: `${baseUrl}/online-compiler/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Fetch Blogs
    let blogPages: MetadataRoute.Sitemap = []
    try {
        const blogsRes = await fetch(`${apiEntryPoint}${getBlogsEndpoint}`, { next: { revalidate: 3600 } })
        const blogsData = await blogsRes.json()
        if (blogsData?.data) {
            blogPages = blogsData.data.map((blog: { slug: string; updatedAt?: string; publishedAt: string }) => ({
                url: `${baseUrl}/blogs/${encodeURIComponent(blog.slug)}`,
                lastModified: new Date(blog.updatedAt || blog.publishedAt),
                priority: 0.7,
            }))
        }
    } catch (e) {
        console.error("Failed to fetch blogs for sitemap", e)
    }

    // Fetch Apti Tags
    let aptiPages: MetadataRoute.Sitemap = []
    try {
        const aptiRes = await fetch(`${apiEntryPoint}${getAptiQuestionTagEndpoint}`, { next: { revalidate: 3600 } })
        const aptiData = await aptiRes.json()
        if (aptiData) {
            const { topics, categories, companies } = aptiData

            const topicPages = (topics || []).map((t: { value: string }) => ({
                url: `${baseUrl}/aptitude/topic/${encodeURIComponent(t.value)}`,
                lastModified: new Date(),
                priority: 0.6
            }))
            const categoryPages = (categories || []).map((t: { value: string }) => ({
                url: `${baseUrl}/aptitude/category/${encodeURIComponent(t.value)}`,
                lastModified: new Date(),
                priority: 0.6
            }))
            const companyPages = (companies || []).map((t: { value: string }) => ({
                url: `${baseUrl}/aptitude/company/${encodeURIComponent(t.value)}`,
                lastModified: new Date(),
                priority: 0.6
            }))
            aptiPages = [...topicPages, ...categoryPages, ...companyPages]
        }
    } catch (e) {
        console.error("Failed to fetch apti tags for sitemap", e)
    }

    // Fetch Apti Questions
    let questionPages: MetadataRoute.Sitemap = []
    try {
        const questionsRes = await fetch(`${apiEntryPoint}${getAllAptiQuestionsEndpoint}?limit=10000`, { next: { revalidate: 3600 } })
        const questionsData = await questionsRes.json()
        if (questionsData?.data) {
            questionPages = questionsData.data.map((q: { slug: string }) => ({
                url: `${baseUrl}/aptitude/problem/${encodeURIComponent(q.slug)}`,
                lastModified: new Date(),
                priority: 0.8,
            }))
        }
    } catch (e) {
        console.error("Failed to fetch questions for sitemap", e)
    }

    return [...staticPages, ...compilerPages, ...blogPages, ...aptiPages, ...questionPages]
}
