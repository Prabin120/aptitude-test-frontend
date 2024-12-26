'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { withAdminAuth } from '@/components/withAdminAuth'

const adminLinks = [
  {
    section: 'Code',
    links: [
      { href: '/code/add-question', label: 'Add Question' },
      { href: '/code/add-testcase', label: 'Add Testcase' },
      { href: '/code/modify-question', label: 'Modify Question' },
    ],
  },
  {
    section: 'Aptitude Test',
    links: [
      { href: '/apti-test/add-question', label: 'Add Question' },
      { href: '/apti-test/modify-question', label: 'Modify Question' },
      { href: '/apti-test/add-tags', label: 'Add Tags' },
    ],
  },
  {
    section: 'Test / Exam',
    links: [
      { href: '/tests/add-test', label: 'Add Test or Exam' },]
  }
]

function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminLinks.map((section) => (
          <Card key={section.section}>
            <CardHeader>
              <CardTitle>{section.section}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default withAdminAuth(AdminDashboard)