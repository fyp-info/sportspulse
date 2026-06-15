'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2, Download, X, AlertTriangle, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { downloadCsv } from '@/lib/csv'
import MaintenanceToggle from '@/components/dashboard/MaintenanceToggle'

interface BlockedIP {
  id: string
  ip: string
  reason: string
  addedBy: string
  date: string
}

interface FailedLoginRow {
  id: string
  ip: string
  attempts: number
  lastAttempt: string
  country: string
  blocked: boolean
}

export default function SuperAdminSecurityPage() {
  const [blockList, setBlockList] = useState<BlockedIP[]>([])
  const [failedLogins, setFailedLogins] = useState<FailedLoginRow[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [unblocking, setUnblocking] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/security', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setBlockList(d.blockedIps ?? [])
          setFailedLogins(d.failedLogins ?? [])
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const removeFromBlockList = (id: string) => {
    setBlockList((prev) => prev.filter((item) => item.id !== id))
    fetch(`/api/security/blocked-ips/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const unblockFailedLogin = async (id: string) => {
    setUnblocking(id)
    await fetch(`/api/security/failed-logins/${id}`, { method: 'DELETE' }).catch(() => {})
    setFailedLogins((prev) => prev.filter((r) => r.id !== id))
    setUnblocking(null)
  }

  const addIp = async (data: { ip: string; reason: string; addedBy: string }) => {
    const res = await fetch('/api/security/blocked-ips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.blockedIp) {
      setBlockList((prev) => [...prev, json.blockedIp])
    }
  }

  const exportCsv = () => {
    downloadCsv(
      'ip-block-list.csv',
      ['IP Address', 'Reason', 'Added By', 'Date'],
      blockList.map((r) => [r.ip, r.reason, r.addedBy, r.date])
    )
  }

  const autoBlocked = failedLogins.filter((r) => r.blocked)
  const underWatch  = failedLogins.filter((r) => !r.blocked)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blocked IP addresses and monitor failed login attempts</p>
        </div>
        <MaintenanceToggle />
      </div>

      {/* Auto-blocked IPs (from failed login attempts) */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Auto-blocked IPs</h3>
            {autoBlocked.length > 0 && <Badge variant="destructive">{autoBlocked.length}</Badge>}
          </div>
          <p className="text-xs text-gray-400">IPs automatically blocked after 5 consecutive failed login attempts</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['IP Address', 'Attempts', 'Last Attempt', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {autoBlocked.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No auto-blocked IPs.</td>
                </tr>
              ) : (
                autoBlocked.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-red-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-gray-800">{row.ip}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-red-600">{row.attempts}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{row.lastAttempt}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                        disabled={unblocking === row.id}
                        onClick={() => unblockFailedLogin(row.id)}
                      >
                        {unblocking === row.id ? 'Unblocking…' : 'Unblock'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failed login attempts (not yet blocked) */}
      {underWatch.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Failed Login Attempts</h3>
            <Badge variant="warning">{underWatch.length}</Badge>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['IP Address', 'Attempts', 'Last Attempt'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {underWatch.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.ip}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${row.attempts >= 4 ? 'text-orange-500' : 'text-gray-700'}`}>
                        {row.attempts}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{row.lastAttempt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual IP Block List */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Manual IP Block List</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={blockList.length === 0}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add IP
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['IP Address', 'Reason', 'Added By', 'Date', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blockList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No IPs manually blocked.</td>
                </tr>
              )}
              {blockList.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.ip}</td>
                  <td className="px-4 py-3 text-gray-600">{row.reason}</td>
                  <td className="px-4 py-3 text-orange-500">{row.addedBy}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.date}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFromBlockList(row.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddIpModal onClose={() => setShowAdd(false)} onAdd={addIp} />}
    </div>
  )
}

function AddIpModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: { ip: string; reason: string; addedBy: string }) => void }) {
  const [ip, setIp] = useState('')
  const [reason, setReason] = useState('')
  const [addedBy, setAddedBy] = useState('superadmin')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ip.trim() || !reason.trim()) {
      setError('IP address and reason are required.')
      return
    }
    onAdd({ ip: ip.trim(), reason: reason.trim(), addedBy: addedBy.trim() || 'superadmin' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-2xl p-7 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Block an IP Address</h2>
          <p className="text-gray-500 text-sm mt-1.5">Add an IP to the block list with details.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>IP Address</Label>
            <Input placeholder="e.g. 203.44.12.3" value={ip} onChange={(e) => { setIp(e.target.value); setError('') }} />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input placeholder="e.g. Brute force attempt" value={reason} onChange={(e) => { setReason(e.target.value); setError('') }} />
          </div>
          <div className="space-y-2">
            <Label>Added By</Label>
            <Input placeholder="Your username" value={addedBy} onChange={(e) => setAddedBy(e.target.value)} />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-11" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 h-11"><Plus className="h-4 w-4" /> Add IP</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
