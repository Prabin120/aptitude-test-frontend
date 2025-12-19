import React from 'react'
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

  return (
    <ReduxProvider>
      <AptitudeListingClient
        topics={topics || []}
        categories={categories || []}
        companies={companies || []}
        initialSearch={search}
      />
    </ReduxProvider>
  )
}