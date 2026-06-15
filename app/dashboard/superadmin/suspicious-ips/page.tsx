'use client'

import { useState, useMemo, useEffect } from 'react'
import { Shield, ShieldOff, Trash2, Pencil, X, Search, AlertTriangle, Ban, Globe, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { SuspiciousIP, IPStatus, ThreatLevel } from '@/lib/mock-data/users'
import { downloadCsv } from '@/lib/csv'

const threatColors: Record<ThreatLevel, string> = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:    'bg-green-100 text-green-700 border-green-200',
}

const statusColors: Record<IPStatus, string> = {
  blocked:    'bg-red-100 text-red-700 border-red-200',
  suspicious: 'bg-orange-100 text-orange-700 border-orange-200',
  clean:      'bg-green-100 text-green-700 border-green-200',
}

export default function SuspiciousIPsPage() {
  const [ips, setIps] = useState<SuspiciousIP[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/suspicious-ips', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setIps(d.ips ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<IPStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return ips.filter((ip) => {
      const matchesSearch =
        ip.ip.includes(search) ||
        ip.country.toLowerCase().includes(search.toLowerCase()) ||
        ip.city.toLowerCase().includes(search.toLowerCase()) ||
        ip.network.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || ip.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [ips, search, filterStatus])

  const toggle = (id: string, action: 'block' | 'unblock') => {
    const status: IPStatus = action === 'block' ? 'blocked' : 'suspicious'
    setIps((prev) => prev.map((ip) => (ip.id === id ? { ...ip, status } : ip)))
    setEditingId(null)
    fetch(`/api/suspicious-ips/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {})
  }

  const remove = (id: string) => {
    setIps((prev) => prev.filter((ip) => ip.id !== id))
    setEditingId(null)
    fetch(`/api/suspicious-ips/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const blocked    = ips.filter((ip) => ip.status === 'blocked').length
  const suspicious = ips.filter((ip) => ip.status === 'suspicious').length
  const highThreat = ips.filter((ip) => ip.threat === 'high').length

  const exportCsv = () => {
    downloadCsv(
      'suspicious-ips.csv',
      ['IP Address', 'Country', 'City', 'Network', 'Threat', 'Attempts', 'Last Seen', 'Status'],
      filtered.map((ip) => [ip.ip, ip.country, ip.city, ip.network, ip.threat, ip.attempts, ip.lastSeen, ip.status])
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suspicious IPs</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage flagged IP addresses</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Ban className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{blocked}</p>
            <p className="text-xs text-gray-400">Blocked IPs</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{suspicious}</p>
            <p className="text-xs text-gray-400">Under Watch</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{highThreat}</p>
            <p className="text-xs text-gray-400">High Threat</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search IP, country, city, network…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'blocked', 'suspicious', 'clean'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                filterStatus === s
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['IP Address', 'Country', 'City', 'Network', 'Threat', 'Attempts', 'Last Seen', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-400">No IPs match your filters.</td>
                </tr>
              )}
              {filtered.map((ip) => {
                const isEditing = editingId === ip.id
                return (
                  <tr
                    key={ip.id}
                    className={`border-b border-gray-50 transition-colors ${isEditing ? 'bg-orange-50/60' : 'hover:bg-gray-50'}`}
                  >
                    {/* IP */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-gray-800">{ip.ip}</span>
                    </td>

                    {/* Country */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700">{ip.country}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-4 py-3 text-gray-600">{ip.city}</td>

                    {/* Network */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 font-mono">{ip.network}</span>
                    </td>

                    {/* Threat */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${threatColors[ip.threat]}`}>
                        {ip.threat}
                      </span>
                    </td>

                    {/* Attempts */}
                    <td className="px-4 py-3">
                      <span className={`font-bold ${ip.attempts >= 10 ? 'text-red-600' : ip.attempts >= 4 ? 'text-orange-500' : 'text-gray-700'}`}>
                        {ip.attempts}
                      </span>
                    </td>

                    {/* Last Seen */}
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{ip.lastSeen}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${statusColors[ip.status]}`}>
                        {ip.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          {ip.status === 'blocked' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => toggle(ip.id, 'unblock')}
                            >
                              <ShieldOff className="h-3.5 w-3.5 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => toggle(ip.id, 'block')}
                            >
                              <Shield className="h-3.5 w-3.5 mr-1" />
                              Block
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => remove(ip.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(ip.id)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {ips.length} entries
        </div>
      </div>
    </div>
  )
}
