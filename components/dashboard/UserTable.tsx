'use client'

import { useState } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { mockUsers, type Role } from '@/lib/mock-data/users'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UserFormModal, { type UserFormValues } from '@/components/dashboard/UserFormModal'
import Toast from '@/components/dashboard/Toast'

const roleColors: Record<string, string> = {
  user: 'outline',
  editor: 'secondary',
  moderator: 'warning',
  admin: 'destructive',
  superadmin: 'default',
}

interface UserRow {
  id: string
  username: string
  email: string
  role: Role
  lastLogin: string
}

export default function UserTable() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserRow[]>(
    mockUsers.map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role, lastLogin: u.lastLogin }))
  )
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; row?: UserRow } | null>(null)
  const [toast, setToast] = useState('')

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = (values: UserFormValues) => {
    if (modal?.mode === 'edit' && modal.row) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === modal.row!.id ? { ...u, username: values.username, email: values.email, role: values.role } : u
        )
      )
      setToast(`Changes saved — an update notification was emailed to ${values.email}.`)
    } else {
      setUsers((prev) => [
        ...prev,
        { id: `new-${Date.now()}`, username: values.username, email: values.email, role: values.role, lastLogin: 'Just now' },
      ])
      setToast(`Invite sent — a verification email was sent to the new ${values.role} at ${values.email}.`)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="primary" size="sm" className="sm:ml-auto" onClick={() => setModal({ mode: 'create' })}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['User', 'Email', 'Role', 'Last Login', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                      {u.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">{u.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={roleColors[u.role] as any} className="capitalize">{u.role}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-gray-700"
                      onClick={() => setModal({ mode: 'edit', row: u })}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <UserFormModal
          title={modal.mode === 'edit' ? 'Edit User' : 'Add User'}
          subtitle={modal.mode === 'edit' ? 'Update this user account.' : 'Create a new user account.'}
          roleOptions={['editor', 'moderator']}
          submitLabel={modal.mode === 'edit' ? 'Save Changes' : 'Add User'}
          passwordOptional={modal.mode === 'edit'}
          initial={modal.row ? { fullName: modal.row.username, email: modal.row.email, username: modal.row.username, role: modal.row.role } : undefined}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
