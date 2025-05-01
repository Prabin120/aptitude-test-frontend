'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useCheckCreatorAccess } from '@/hooks/reactQuery'
import UnauthorizedPage from '@/app/unauthorized/page'
import Loading from '@/app/loading'

// Create a client
const queryClient = new QueryClient()

export function withCreatorAccess<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function WithCreatorAccess(props: P) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
      <QueryClientProvider client={queryClient}>
        <CreatorAccess>
          <WrappedComponent {...props} />
        </CreatorAccess>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
  return WithCreatorAccess;
}

function CreatorAccess({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: isCreator, isLoading, isError } = useCheckCreatorAccess()

  if (isLoading) return <Loading />
  if (!isCreator || isError) return <UnauthorizedPage />

  return <>{children}</>
}

