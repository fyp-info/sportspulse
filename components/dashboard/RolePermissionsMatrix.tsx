'use client'

import { useState, useEffect } from 'react'
import { Check, Save, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PermissionRow } from '@/lib/permissions'

const allRoles = ['user', 'editor', 'moderator', 'admin', 'superadmin'] as const
type RoleKey = (typeof allRoles)[number]

function PermCheckbox({
  checked, onChange, disabled,
}: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`mx-auto flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
        checked
          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
          : 'bg-white border-gray-300'
      } ${disabled ? 'cursor-default opacity-90' : 'hover:border-orange-400 cursor-pointer'}`}
    >
      {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </button>
  )
}

interface Props {
  displayRoles?: readonly RoleKey[]
  /** Superadmin can edit + save; everyone else sees a read-only view. */
  canEdit?: boolean
}

export default function RolePermissionsMatrix({
  displayRoles = allRoles,
  canEdit = false,
}: Props) {
  const [rows, setRows] = useState<PermissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Load the persisted matrix (already scoped to the viewer's grants by the API).
  useEffect(() => {
    fetch('/api/role-permissions', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setRows(d.permissions ?? []))
      .catch(() => setError('Could not load permissions.'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (rowIdx: number, role: RoleKey) => {
    if (!canEdit || role === 'superadmin') return // superadmin column is locked on
    setRows((prev) => prev.map((row, i) => (i === rowIdx ? { ...row, [role]: !row[role] } : row)))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/role-permissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: rows }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'Save failed')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-400">Loading permissions…</div>
  }

  return (
    <div className="space-y-4">
      {!canEdit && (
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-500">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          These are the permissions the Super Admin has granted to your role and the roles you manage.
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Permission</th>
              {displayRoles.map((r) => (
                <th key={r} className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={displayRoles.length + 1} className="px-4 py-8 text-center text-sm text-gray-400">No permissions granted.</td></tr>
            ) : (
              rows.map((perm, rowIdx) => (
                <tr key={perm.permission} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{perm.label}</td>
                  {displayRoles.map((r) => (
                    <td key={r} className="px-4 py-3 text-center">
                      <PermCheckbox
                        checked={perm[r]}
                        onChange={() => toggle(rowIdx, r)}
                        disabled={!canEdit || r === 'superadmin'}
                      />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {canEdit && (
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Permissions saved
            </span>
          )}
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Permissions'}
          </Button>
        </div>
      )}
    </div>
  )
}
