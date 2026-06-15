'use client'

import RequireAuth from '@/components/auth/RequireAuth'
import ProfileTabContent from '@/components/dashboard/ProfileTabContent'

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <ProfileTabContent />
      </div>
    </RequireAuth>
  )
}
