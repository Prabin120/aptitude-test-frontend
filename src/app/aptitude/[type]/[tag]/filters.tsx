"use client"

import { HeaderBackWithText } from '@/components/headerBackWithText'
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
    <div className="flex justify-between py-4 items-center">
      <HeaderBackWithText text={decodeURIComponent(tag).replace(/%20/g, ' ')} href={`/aptitude/${type}`} />
      <Button onClick={handleStartTest} variant="default" className='text-primary-text'>
        Start Test
      </Button>
    </div>
  )
}

export default QuestionsFilters