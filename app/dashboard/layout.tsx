'use client'

import { useStaffAuth } from '@/lib/store/auth-store'
import Sidebar from '@/components/layout/Sidebar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useStaffAuth()
  const router = useRouter()

  // The edge proxy already gates /dashboard; this is a client-side safety net
  // that only fires once hydration finishes and confirms no session.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [loading, isAuthenticated, router])

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
