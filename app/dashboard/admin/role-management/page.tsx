'use client'

import { Crown } from 'lucide-react'
import RolePermissionsMatrix from '@/components/dashboard/RolePermissionsMatrix'
import StaffManager from '@/components/dashboard/StaffManager'
import ResetRequests from '@/components/dashboard/ResetRequests'

export default function AdminRoleManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        </div>
        <p className="text-gray-500 text-sm">Create and manage editor and moderator accounts</p>
      </div>

      {/* Admins can only create editor / moderator */}
      <StaffManager allowedRoles={['editor', 'moderator']} />

      {/* Password reset requests from editor / moderator */}
      <ResetRequests />

      {/* Read-only: shows the permissions of the roles the admin manages
          (editor / moderator). Admins cannot create or manage other admins. */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Permissions Matrix</h3>
        <RolePermissionsMatrix displayRoles={['editor', 'moderator']} />
      </div>
    </div>
  )
}
