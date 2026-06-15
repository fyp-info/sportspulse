'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserAuth } from '@/lib/store/auth-store'

// Redirects logged-out visitors to /login. Renders nothing until the session
// is hydrated, so there's no flash of protected content.
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [loading, isAuthenticated, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-sm text-gray-400">Loading…</div>
    )
  }

  return <>{children}</>
}
