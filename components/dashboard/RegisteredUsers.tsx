'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { downloadCsv } from '@/lib/csv'

interface RegisteredUser {
  id: string
  name: string
  username: string
  email: string
  ip: string
  lastSeen: string
  country: string
  city: string
  network: string
}

export default function RegisteredUsers() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/registered-users', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setUsers(d.users ?? []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.ip.toLowerCase().includes(q) ||
      u.country.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    )
  })

  const exportCsv = () => {
    downloadCsv(
      'registered-users.csv',
      ['Name', 'Username', 'Email', 'IP Address', 'Last Seen', 'Country', 'City', 'Network'],
      filtered.map((u) => [u.name, u.username, u.email, u.ip, u.lastSeen, u.country, u.city, u.network]),
    )
  }

  const cols = ['Name', 'Username', 'Email', 'IP Address', 'Last Seen', 'Country', 'City', 'Network']

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
            <p className="text-gray-500 text-sm mt-0.5">Members who signed up, with their last-known location</p>
          </div>
        </div>
        {!loading && (
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{users.length} users</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search name, email, IP, country…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="sm:ml-auto" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {cols.map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={cols.length} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-4 py-10 text-center text-sm text-gray-400">
                {users.length === 0 ? 'No registered users yet.' : 'No users match your search.'}
              </td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.username}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{u.ip}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{u.lastSeen}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.country}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.city}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{u.network}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
