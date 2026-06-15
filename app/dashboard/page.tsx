'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStaffAuth } from '@/lib/store/auth-store'
import { roleHome, type Role } from '@/lib/auth/roles'

export default function DashboardIndex() {
  const { user, isAuthenticated, loading } = useStaffAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated || !user) {
      router.replace('/login')
    } else {
      router.replace(roleHome(user.role as Role))
    }
  }, [loading, isAuthenticated, user, router])

  return null
}
