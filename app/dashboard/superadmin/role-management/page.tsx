'use client'

import { Crown } from 'lucide-react'
import RolePermissionsMatrix from '@/components/dashboard/RolePermissionsMatrix'
import StaffManager from '@/components/dashboard/StaffManager'
import ResetRequests from '@/components/dashboard/ResetRequests'

export default function SuperAdminRoleManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        </div>
        <p className="text-gray-500 text-sm">Create and manage editor, moderator and admin accounts</p>
      </div>

      {/* Create / manage staff (editor, moderator, admin) */}
      <StaffManager allowedRoles={['editor', 'moderator', 'admin']} />

      {/* Password reset requests (all roles) */}
      <ResetRequests />

      {/* Permissions matrix — superadmin can edit & persist grants */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Permissions Matrix</h3>
        <p className="text-sm text-gray-500">Grant or revoke access per role. Changes are saved and each role only sees the permissions you give them.</p>
        <RolePermissionsMatrix displayRoles={['editor', 'moderator', 'admin', 'superadmin']} canEdit />
      </div>
    </div>
  )
}
