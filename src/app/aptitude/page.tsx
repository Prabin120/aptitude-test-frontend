import React from 'react'
export const dynamic = 'force-dynamic'
import AptitudeListingClient from './AptitudeListingClient'
import ReduxProvider from '@/redux/redux-provider'
import { apiEntryPoint, getAptiQuestionTagEndpoint } from '@/consts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Aptitude Questions | AptiCode",
  description: "Practice aptitude questions by topic, category, or company."
}

async function getTags(search: string) {
  try {
    const res = await fetch(`${apiEntryPoint}${getAptiQuestionTagEndpoint}?search=${search}`, { next: { revalidate: 3600 } })
    if (!res.ok) return { topics: [], categories: [], companies: [] }
    return await res.json()
  } catch (e) {
    console.error("Error fetching tags", e)
    return { topics: [], categories: [], companies: [] }
  }
}

export default async function AptiZone({ searchParams }: { searchParams: { search?: string } }) {
  const search = searchParams.search ?? ""
  const { topics, categories, companies } = await getTags(search)

  // Robust fallback: Filter and slice on frontend server-side to handle potential backend issues
  const filteredTopics = (topics || [])
    .filter((t: { value: string }) => t.value.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6)

  const filteredCategories = (categories || [])
    .filter((t: { value: string }) => t.value.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6)

  const filteredCompanies = (companies || [])
    .filter((t: { value: string }) => t.value.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6)

  return (
    <ReduxProvider>
      <AptitudeListingClient
        topics={filteredTopics}
        categories={filteredCategories}
        companies={filteredCompanies}
        initialSearch={search}
      />
    </ReduxProvider>
  )
}