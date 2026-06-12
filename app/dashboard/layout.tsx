'use client'

import { useAuthStore } from '@/lib/store/auth-store'
import Sidebar from '@/components/layout/Sidebar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, switchRole } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      switchRole('user')
    }
  }, [isAuthenticated, switchRole])

  return (
    <div className="flex min-h-screen bg-[#f8faff]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
