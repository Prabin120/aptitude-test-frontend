import React from 'react'
import ReduxProvider from '@/redux/redux-provider'
import { Metadata } from 'next'
import { apiEntryPoint, getAptiQuestionBySlugEndpoint } from '@/consts'
import AptitudeQuestionPage from './QuestionClient'
import { HeaderBackWithText } from '@/components/headerBackWithText'

// Server-side fetching
async function getQuestion(slug: string) {
    try {
        const res = await fetch(`${apiEntryPoint}${getAptiQuestionBySlugEndpoint(slug)}`, { next: { revalidate: 3600 } })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        console.error("Error fetching question", e)
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const data = await getQuestion(params.slug)
    const question = data?.question

    if (!question) {
        return {
            title: "Question Not Found | AptiCode",
            description: "The aptitude question you are looking for does not exist."
        }
    }

    return {
        title: `${question.title} | Aptitude Question | AptiCode`,
        description: question.description.substring(0, 160) + "...",
        keywords: [...question.topics, ...question.companies, "aptitude", "interview questions", "placement preparation"]
    }
}

export default async function QuestionPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const data = await getQuestion(slug)

    // JSON-LD Structured Data
    const jsonLd = data?.question ? {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        'name': data.question.title,
        'description': data.question.description,
        'hasPart': [
            {
                '@type': 'Question',
                'name': data.question.title,
                'text': data.question.description,
                'suggestedAnswer': data.question.type === "MCQ" ?
                    data.question.options.map((opt: string) => ({
                        '@type': 'Answer',
                        'text': opt
                    })) : undefined,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': data.question.answers.map((ansIndex: number) => data.question.options[ansIndex - 1]).join(", ")
                }
            }
        ]
    } : null

    return (
        <ReduxProvider>
            <main className='dark'>
                {jsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                )}
                <div className="mx-5">
                    <HeaderBackWithText text={""} href="/aptitude/all-questions" />
                </div>
                <AptitudeQuestionPage
                    slug={slug}
                    initialQuestion={data?.question || null}
                    prevSlug={data?.prevQuestionSlug || ""}
                    nextSlug={data?.nextQuestionSlug || ""}
                />
            </main>
        </ReduxProvider>
    )
}