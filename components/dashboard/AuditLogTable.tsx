'use client'

import { useState, useEffect, useMemo } from 'react'
import { Download, RefreshCw, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStaffAuth } from '@/lib/store/auth-store'

interface Log {
  id: string
  user: string
  action: string
  target: string
  date: string
  ip: string
  category: string
  status: string
}

const CATEGORY_STYLES: Record<string, string> = {
  login: 'bg-green-100 text-green-700',
  logout: 'bg-blue-100 text-blue-700',
  failed_login: 'bg-amber-100 text-amber-700',
  access_denied: 'bg-red-100 text-red-700',
  '2fa': 'bg-purple-100 text-purple-700',
  admin: 'bg-orange-100 text-orange-700',
  system: 'bg-gray-100 text-gray-600',
}

const CATEGORY_LABELS: Record<string, string> = {
  login: 'Login',
  logout: 'Logout',
  failed_login: 'Failed Login',
  access_denied: 'Access Denied',
  '2fa': '2FA',
  admin: 'Admin',
  system: 'System',
}

const STATUS_STYLES: Record<string, string> = {
  success: 'bg-green-50 text-green-600',
  failed: 'bg-red-50 text-red-600',
  blocked: 'bg-orange-50 text-orange-600',
  denied: 'bg-red-50 text-red-600',
}

const ALL_CATEGORIES = ['all', 'login', 'logout', 'failed_login', 'access_denied', '2fa', 'admin']

function exportCsv(logs: Log[]) {
  const header = 'Date,User,Action,Target,IP,Category,Status'
  const rows = logs.map((l) =>
    [l.date, l.user, `"${l.action.replace(/"/g, '""')}"`, `"${l.target.replace(/"/g, '""')}"`, l.ip, l.category, l.status].join(','),
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AuditLogTable() {
  const { user } = useStaffAuth()
  const isSuperAdmin = user?.role === 'superadmin'

  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/audit-logs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setLogs(d.logs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const visible = useMemo(
    () => (filter === 'all' ? logs : logs.filter((l) => l.category === filter)),
    [logs, filter],
  )

  const deleteOne = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/audit-logs/${id}`, { method: 'DELETE' })
      if (res.ok) setLogs((prev) => prev.filter((l) => l.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const clearAll = async () => {
    setClearing(true)
    try {
      const res = await fetch('/api/audit-logs', { method: 'DELETE' })
      if (res.ok) { setLogs([]); setClearConfirm(false) }
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Clear-all confirmation banner */}
      {clearConfirm && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 flex-1">This will permanently delete all {logs.length} audit log entries. This cannot be undone.</p>
          <Button variant="outline" size="sm" onClick={() => setClearConfirm(false)}>Cancel</Button>
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={clearAll}
            disabled={clearing}
          >
            {clearing ? 'Clearing…' : 'Yes, clear all'}
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? `All (${logs.length})` : CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400">{visible.length} entries</p>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportCsv(visible)} disabled={visible.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          {isSuperAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => setClearConfirm(true)}
              disabled={logs.length === 0 || clearConfirm}
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Category', 'Status', 'User', 'Action', 'Target', 'IP', 'Date', ...(isSuperAdmin ? [''] : [])].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={isSuperAdmin ? 8 : 7} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={isSuperAdmin ? 8 : 7} className="px-4 py-8 text-center text-sm text-gray-400">No audit logs yet.</td></tr>
            ) : (
              visible.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap ${CATEGORY_STYLES[log.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {CATEGORY_LABELS[log.category] ?? log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${STATUS_STYLES[log.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-orange-500 whitespace-nowrap">{log.user}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{log.action}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs max-w-45 truncate">{log.target}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">{log.ip}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{log.date}</td>
                  {isSuperAdmin && (
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteOne(log.id)}
                        disabled={deletingId === log.id}
                        title="Delete this entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
