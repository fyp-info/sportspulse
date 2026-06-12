'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import type { Role } from '@/lib/mock-data/users'
import { ChevronUp, ChevronDown, Users } from 'lucide-react'

const roles: { value: Role; label: string; color: string }[] = [
  { value: 'user', label: 'User', color: 'bg-gray-600' },
  { value: 'editor', label: 'Editor', color: 'bg-blue-600' },
  { value: 'moderator', label: 'Moderator', color: 'bg-purple-600' },
  { value: 'admin', label: 'Admin', color: 'bg-red-600' },
  { value: 'superadmin', label: 'Super Admin', color: 'bg-orange-600' },
]

export default function RoleSwitcher() {
  const { user, switchRole } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-1.5 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl min-w-40">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">Dev: Switch Role</p>
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => { switchRole(r.value); setOpen(false) }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 ${r.color} ${user?.role === r.value ? 'ring-2 ring-gray-400/40' : 'opacity-75 hover:opacity-100'}`}
            >
              {user?.role === r.value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              {r.label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-2">
            <p className="text-[10px] text-gray-400 px-1">Active: <span className="text-orange-500 capitalize">{user?.role ?? 'none'}</span></p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Users className="h-4 w-4" />
        <span className="capitalize">{user?.role ?? 'Not logged in'}</span>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
