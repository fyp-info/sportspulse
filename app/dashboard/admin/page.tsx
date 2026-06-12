'use client'

import { Users, Shield, ClipboardList, Activity, Plus, Lock } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import UserTable from '@/components/dashboard/UserTable'
import AuditLogTable from '@/components/dashboard/AuditLogTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers, failedLoginAttempts, ipBlockList, mockSessions } from '@/lib/mock-data/users'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Full platform management and oversight</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockUsers.length} icon={Users} change={8} changeLabel="this month" />
        <StatCard title="Active Sessions" value={mockSessions.length * 12} icon={Activity} color="text-blue-500" />
        <StatCard title="Blocked IPs" value={ipBlockList.length} icon={Shield} color="text-red-500" />
        <StatCard title="Failed Logins" value={failedLoginAttempts.length * 3} icon={Lock} color="text-yellow-500" />
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-5">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">All Users</h3>
              <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> Add User</Button>
            </div>
            <UserTable />
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Failed Login Attempts</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['IP Address', 'Attempts', 'Last Attempt', 'Country', 'Status'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {failedLoginAttempts.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.ip}</td>
                        <td className="px-4 py-3 font-bold text-red-500">{row.attempts}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{row.lastAttempt}</td>
                        <td className="px-4 py-3 text-gray-600">{row.country}</td>
                        <td className="px-4 py-3">
                          <Badge variant={row.blocked ? 'destructive' : 'warning'}>
                            {row.blocked ? 'Blocked' : 'Active'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">IP Block List</h3>
                <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> Add IP</Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['IP Address', 'Reason', 'Added By', 'Date', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ipBlockList.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.ip}</td>
                        <td className="px-4 py-3 text-gray-600">{row.reason}</td>
                        <td className="px-4 py-3 text-orange-500">{row.addedBy}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{row.date}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600">Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-5">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <AuditLogTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
