'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useCheckAdminAccess } from '@/hooks/reactQuery'
import UnauthorizedPage from '@/app/unauthorized/page'
import Loading from '@/app/loading'

// Create a client
const queryClient = new QueryClient()

export function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    // Render nothing on the server
    if (!mounted) return null

    return (
      <QueryClientProvider client={queryClient}>
        <AdminAuthCheck>
          <WrappedComponent {...props} />
        </AdminAuthCheck>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  }
}

function AdminAuthCheck({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: isAdmin, isLoading, isError } = useCheckAdminAccess()

  if (isLoading) return <Loading />
  if (!isAdmin || isError) return <UnauthorizedPage />

  return <>{children}</>
}

