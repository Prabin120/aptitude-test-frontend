"use client"

import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux/store'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const QuestionsFilters = ({ type, tag }: { type: string, tag: string }) => {
  const authenticate = useAppSelector((state) => state.auth.authState);
  const url = usePathname()
  const router = useRouter()
  const handleStartTest = () => {
    if (!authenticate) {
      alert("Please login first")
    } else {
      router.push(`${url}/test`)
    }
  }
  return (
    <div className="flex justify-between mb-6 p-4 items-center">
      <h2>{`${type}/${decodeURIComponent(tag).replace(/%20/g, ' ')}`}</h2>
      <Button onClick={handleStartTest} variant="default" className='text-primary-text'>
        Start Test
      </Button>
    </div>
  )
}

export default QuestionsFilters