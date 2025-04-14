"use client"

import { withAdminAuth } from '@/components/withAdminAuth'
import AdminQuestions from './questions'

function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <AdminQuestions/>
    </div>
  )
}

export default withAdminAuth(AdminDashboard)