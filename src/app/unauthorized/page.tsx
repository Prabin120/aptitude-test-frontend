import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
        Return to Home
      </Link>
    </div>
  )
}

