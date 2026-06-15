'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Ban, CheckCircle2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UserFormModal, { type UserFormValues } from '@/components/dashboard/UserFormModal'
import Toast from '@/components/dashboard/Toast'
import type { Role } from '@/lib/auth/roles'

interface StaffRow {
  id: string
  username: string
  name: string
  email: string
  role: Role
  isActive: boolean
  lastLogin: string
}

const roleBadge: Record<string, 'secondary' | 'warning' | 'destructive' | 'default'> = {
  editor: 'secondary',
  moderator: 'warning',
  admin: 'destructive',
  superadmin: 'default',
}

export default function StaffManager({ allowedRoles }: { allowedRoles: Role[] }) {
  const [rows, setRows] = useState<StaffRow[]>([])
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; row?: StaffRow } | null>(null)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch(`/api/users?roles=${allowedRoles.join(',')}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setRows(d.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Returns an error message on failure (keeps the modal open) or null on success.
  const submit = async (values: UserFormValues): Promise<string | null> => {
    try {
      if (modal?.mode === 'edit' && modal.row) {
        const id = modal.row.id
        const res = await fetch(`/api/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: values.username, name: values.fullName, email: values.email, role: values.role,
            ...(values.password ? { password: values.password } : {}),
          }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) return json.error ?? 'Could not save changes.'
        setRows((p) => p.map((r) => (r.id === id ? { ...r, username: values.username, name: values.fullName, email: values.email, role: values.role } : r)))
        setToast('Changes saved.')
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: values.username, name: values.fullName, email: values.email, password: values.password, role: values.role }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) return json.error ?? 'Could not create account.'
        setRows((p) => [{ ...json.user, name: values.fullName }, ...p])
        setToast(`Account created — login details emailed to ${values.email}.`)
      }
      return null
    } catch {
      return 'Network error. Please try again.'
    }
  }

  const toggleActive = async (row: StaffRow) => {
    const next = !row.isActive
    setRows((p) => p.map((r) => (r.id === row.id ? { ...r, isActive: next } : r)))
    const res = await fetch(`/api/users/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: next }),
    })
    if (!res.ok) {
      setRows((p) => p.map((r) => (r.id === row.id ? { ...r, isActive: row.isActive } : r))) // revert
      const j = await res.json().catch(() => ({}))
      setToast(j.error ?? 'Could not update account.')
    } else {
      setToast(next ? 'Account reactivated.' : 'Account suspended.')
    }
  }

  const remove = async (id: string) => {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) { setToast(json.error ?? 'Could not delete account.'); return }
    setRows((p) => p.filter((r) => r.id !== id))
    setToast('Account deleted.')
  }

  const roleLabel = allowedRoles.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(' / ')

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Staff Accounts</h3>
          <span className="text-xs text-gray-400">({roleLabel})</span>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModal({ mode: 'create' })}>
          <Plus className="h-4 w-4" /> Create New Role
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Name', 'Username', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No staff accounts yet. Create one to get started.</td></tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                        {(u.name || u.username).slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.username}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant={roleBadge[u.role]} className="capitalize">{u.role}</Badge></td>
                  <td className="px-4 py-3">
                    {u.isActive
                      ? <Badge variant="success">Active</Badge>
                      : <Badge variant="destructive">Suspended</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" onClick={() => setModal({ mode: 'edit', row: u })} title="Edit">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className={`h-7 w-7 ${u.isActive ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-green-500 hover:text-green-600 hover:bg-green-50'}`}
                        onClick={() => toggleActive(u)}
                        title={u.isActive ? 'Suspend' : 'Reactivate'}
                      >
                        {u.isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => remove(u.id)} title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <UserFormModal
          title={modal.mode === 'edit' ? 'Edit Account' : 'Create New Role'}
          subtitle={modal.mode === 'edit' ? 'Update this staff account.' : 'Create an editor, moderator or admin account.'}
          roleOptions={allowedRoles}
          submitLabel={modal.mode === 'edit' ? 'Save Changes' : 'Create & Email Login'}
          passwordOptional={modal.mode === 'edit'}
          initial={modal.row ? { fullName: modal.row.name, email: modal.row.email, username: modal.row.username, role: modal.row.role } : undefined}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
