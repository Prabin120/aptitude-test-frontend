import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://apticode.in'

    const routes = [
        '',
        '/login',
        '/signup',
        '/forgot-password',
        '/code/problems',
        '/online-compiler',
        '/apti-zone',
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

    return [...staticPages, ...compilerPages]
}
