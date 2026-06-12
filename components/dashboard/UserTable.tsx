'use client'

import { useState } from 'react'
import { Search, RefreshCw, UserX } from 'lucide-react'
import { mockUsers } from '@/lib/mock-data/users'
import { useAuthStore, hasPermission } from '@/lib/store/auth-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const roleColors: Record<string, string> = {
  user: 'outline',
  editor: 'secondary',
  moderator: 'warning',
  admin: 'destructive',
  superadmin: 'default',
}

export default function UserTable() {
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [users] = useState(mockUsers)

  const canAssignRoles = hasPermission(user?.role, 'assignRoles')
  const canBan = hasPermission(user?.role, 'banUser')

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['User', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
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
                  {canAssignRoles ? (
                    <Select defaultValue={u.role}>
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['user', 'editor', 'moderator', 'admin', 'superadmin'].map((r) => (
                          <SelectItem key={r} value={r} className="text-xs capitalize">{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={roleColors[u.role] as any} className="capitalize">{u.role}</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('flex items-center gap-1.5 text-xs font-medium', u.isActive ? 'text-green-600' : 'text-red-500')}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', u.isActive ? 'bg-green-500' : 'bg-red-500')} />
                    {u.isActive ? 'Active' : 'Banned'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {canBan && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50">
                        <UserX className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
