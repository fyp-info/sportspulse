'use client'

import { useEffect } from 'react'
import { useUserAuth, useStaffAuth } from '@/lib/store/auth-store'

// Hydrates both independent sessions (member + staff) from the server on mount.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateUser = useUserAuth((s) => s.hydrate)
  const hydrateStaff = useStaffAuth((s) => s.hydrate)

  useEffect(() => {
    hydrateUser()
    hydrateStaff()
  }, [hydrateUser, hydrateStaff])

  return <>{children}</>
}
