'use client'

import { Settings, Crown, Activity, Shield, Server, Database, Wifi, Plus, Trash2, Edit, Users } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import RolePermissionsMatrix from '@/components/dashboard/RolePermissionsMatrix'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockUsers, auditLogs } from '@/lib/mock-data/users'

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        </div>
        <p className="text-gray-500 text-sm">Full system access and control</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockUsers.length} icon={Users} change={8} />
        <StatCard title="System Uptime" value="99.9%" icon={Server} color="text-green-600" />
        <StatCard title="Active Admins" value="3" icon={Shield} color="text-blue-500" />
        <StatCard title="Live Users" value="1,247" icon={Activity} change={15} color="text-purple-500" />
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="flex-wrap">
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="settings" className="mt-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Password Policy</h3>
              {[
                { label: 'Minimum length', type: 'number', default: '8' },
                { label: 'Password expiry (days)', type: 'number', default: '90' },
              ].map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label className="text-xs">{field.label}</Label>
                  <Input type={field.type} defaultValue={field.default} className="h-8 text-sm" />
                </div>
              ))}
              {[
                { label: 'Require uppercase letters' },
                { label: 'Require numbers' },
                { label: 'Require special characters' },
                { label: 'Block common passwords' },
              ].map((toggle) => (
                <div key={toggle.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{toggle.label}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">2FA Enforcement</h3>
              {['user', 'editor', 'moderator', 'admin', 'superadmin'].map((role) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{role}</span>
                  <Switch defaultChecked={['admin', 'superadmin'].includes(role)} />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-sm font-medium text-gray-800">Session Limits</h4>
                <div className="space-y-1.5">
                  <Label className="text-xs">Max concurrent sessions per user</Label>
                  <Input type="number" defaultValue="5" className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Session timeout (minutes)</Label>
                  <Input type="number" defaultValue="60" className="h-8 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="primary">Save Settings</Button>
          </div>
        </TabsContent>

        {/* Role Management */}
        <TabsContent value="roles" className="mt-5">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">5 roles defined</p>
              <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> Create Role</Button>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {[
                { role: 'user', border: 'border-gray-200' },
                { role: 'editor', border: 'border-blue-200' },
                { role: 'moderator', border: 'border-purple-200' },
                { role: 'admin', border: 'border-red-200' },
                { role: 'superadmin', border: 'border-orange-200', deletable: false },
              ].map((r) => (
                <div key={r.role} className={`rounded-xl border ${r.border} bg-white shadow-sm p-4 flex items-center justify-between`}>
                  <span className="font-medium text-gray-800 capitalize text-sm">{r.role}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 ${r.deletable === false ? 'text-gray-200 cursor-not-allowed' : 'text-red-400 hover:text-red-600'}`}
                      disabled={r.deletable === false}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">Permissions Matrix</h3>
            <RolePermissionsMatrix />
          </div>
        </TabsContent>

        {/* System Health */}
        <TabsContent value="health" className="mt-5">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { icon: Server, label: 'Web Server', status: 'Operational', detail: 'nginx 1.26 · 12ms avg' },
                { icon: Database, label: 'Database', status: 'Operational', detail: 'PostgreSQL 16 · 8ms avg' },
                { icon: Wifi, label: 'Redis Cache', status: 'Operational', detail: 'Redis 7.2 · 2ms avg' },
                { icon: Shield, label: 'CDN', status: 'Operational', detail: 'Cloudflare · 98.7% cache hit' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
                    <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{item.label}</span>
                        <Badge variant="success" className="text-[10px]">{item.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-400">{item.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Threat Dashboard</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Suspicious IPs (last 24h)</p>
                  {['203.44.12.3 (NG)', '185.220.101.5 (NL)', '45.155.205.100 (RU)'].map((ip) => (
                    <div key={ip} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                      <span className="font-mono text-xs text-red-500">{ip}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-red-500 hover:text-red-600 px-2">Block</Button>
                    </div>
                  ))}
                </div>
                <div className="pt-3">
                  <p className="text-xs text-gray-400 mb-2">Failed Login Attempts (7 days)</p>
                  <div className="flex items-end gap-1 h-16">
                    {[12, 8, 24, 6, 18, 32, 14].map((val, i) => (
                      <div key={i} className="flex-1 bg-red-200 rounded-t" style={{ height: `${(val / 32) * 100}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i} className="text-[10px] text-gray-400 flex-1 text-center">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Admin Management */}
        <TabsContent value="admins" className="mt-5">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Admin Accounts</h3>
              <Button variant="primary" size="sm"><Plus className="h-4 w-4" /> Create Admin</Button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Admin', 'Email', 'Role', 'Last Login', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.filter((u) => ['admin', 'superadmin'].includes(u.role)).map((u) => (
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
                        <Badge variant={u.role === 'superadmin' ? 'default' : 'destructive'} className="capitalize">{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin}</td>
                      <td className="px-4 py-3">
                        {u.role !== 'superadmin' && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600">Delete</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
