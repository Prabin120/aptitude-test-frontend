"use client"

import CreatorsQuestions from './questions'
import { withCreatorAccess } from '@/components/withCreatorAccess'

function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <CreatorsQuestions/>
    </div>
  )
}

export default withCreatorAccess(AdminDashboard)