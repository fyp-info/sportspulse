'use client'

import { useState, useEffect } from 'react'
import { KeyRound, Check, X, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Toast from '@/components/dashboard/Toast'

interface ResetRow {
  id: string
  email: string
  fullName: string
  message: string
  role: string | null
  status: 'pending' | 'resolved' | 'rejected'
  date: string
}

export default function ResetRequests() {
  const [rows, setRows] = useState<ResetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [resettingId, setResettingId] = useState<string | null>(null)
  const [newPw, setNewPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  const load = () => {
    fetch('/api/password-reset-requests', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setRows(d.requests ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const resolve = async (id: string) => {
    if (newPw.length < 6) { setToast('Password must be at least 6 characters.'); return }
    setBusy(true)
    const res = await fetch(`/api/password-reset-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolve', newPassword: newPw }),
    })
    const json = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setToast(json.error ?? 'Could not reset password.'); return }
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r)))
    setResettingId(null); setNewPw('')
    setToast('Password reset — the new password was emailed to the user.')
  }

  const reject = async (id: string) => {
    const res = await fetch(`/api/password-reset-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject' }),
    })
    if (!res.ok) { const j = await res.json().catch(() => ({})); setToast(j.error ?? 'Could not dismiss.'); return }
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
    setToast('Request dismissed.')
  }

  const pending = rows.filter((r) => r.status === 'pending')

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900">Password Reset Requests</h3>
        {pending.length > 0 && <Badge variant="warning">{pending.length} pending</Badge>}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400">
          <Inbox className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          No password reset requests.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className={`rounded-xl border p-4 ${r.status === 'pending' ? 'border-orange-100 bg-orange-50/40' : 'border-gray-100 bg-white'}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{r.fullName || r.email}</span>
                    {r.role && <Badge variant="outline" className="capitalize text-[10px]">{r.role}</Badge>}
                    <Badge
                      variant={r.status === 'pending' ? 'warning' : r.status === 'resolved' ? 'success' : 'destructive'}
                      className="capitalize text-[10px]"
                    >
                      {r.status}
                    </Badge>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{r.email}</p>
                  {r.message && <p className="text-sm text-gray-600 mt-1.5 leading-snug">{r.message}</p>}
                </div>

                {r.status === 'pending' && resettingId !== r.id && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setResettingId(r.id); setNewPw('') }} disabled={!r.role}>
                      <KeyRound className="h-3.5 w-3.5 mr-1" /> Reset Password
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => reject(r.id)}>
                      <X className="h-3.5 w-3.5 mr-1" /> Dismiss
                    </Button>
                  </div>
                )}
              </div>

              {resettingId === r.id && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Input
                    type="text"
                    placeholder="New password (min 6 chars)"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="h-9 text-sm max-w-xs"
                  />
                  <Button size="sm" variant="primary" className="h-9 text-xs" onClick={() => resolve(r.id)} disabled={busy || newPw.length < 6}>
                    <Check className="h-3.5 w-3.5 mr-1" /> {busy ? 'Saving…' : 'Set & Email'}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-9 text-xs" onClick={() => { setResettingId(null); setNewPw('') }}>Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
