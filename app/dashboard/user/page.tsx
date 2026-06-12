'use client'

import { MessageSquare, Bookmark, Monitor, Bell, Key, Shield, Eye } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import StatCard from '@/components/dashboard/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { mockSessions, loginHistory } from '@/lib/mock-data/users'
import { mockComments } from '@/lib/mock-data/posts'
import Link from 'next/link'

export default function UserDashboard() {
  const { user } = useAuthStore()
  const myComments = mockComments.filter((c) => c.author === user?.username).slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-orange-100 text-orange-600 text-xl font-bold flex items-center justify-center shrink-0">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <Badge variant="default" className="capitalize text-xs">{user?.role}</Badge>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Last login: {mockSessions[0]?.lastActive}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="My Comments" value="12" icon={MessageSquare} change={8} changeLabel="this month" />
        <StatCard title="Saved Articles" value="34" icon={Bookmark} change={5} changeLabel="new" />
        <StatCard title="Active Sessions" value={mockSessions.length} icon={Monitor} color="text-blue-500" />
        <StatCard title="Profile Views" value="156" icon={Eye} change={12} changeLabel="this week" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Comments */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">My Recent Comments</h3>
          {myComments.length > 0 ? (
            <div className="space-y-3">
              {myComments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-700 line-clamp-2">{c.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={c.status === 'approved' ? 'success' : 'warning'} className="text-[10px]">{c.status}</Badge>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No comments yet. <Link href="/blog" className="text-orange-500 hover:underline">Read articles</Link> to join the discussion.</p>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { label: 'Breaking news', desc: 'Instant alerts for major sports news' },
              { label: 'Match reminders', desc: '1 hour before your followed matches' },
              { label: 'Comment replies', desc: 'When someone replies to your comment' },
              { label: 'Weekly digest', desc: 'Top stories every Monday' },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{pref.label}</p>
                  <p className="text-xs text-gray-500">{pref.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Device', 'IP', 'Location', 'Last Active', ''].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockSessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-gray-800">{s.device}</td>
                  <td className="py-3 text-gray-500 font-mono text-xs">{s.ip}</td>
                  <td className="py-3 text-gray-500">{s.location}</td>
                  <td className="py-3 text-gray-500">{s.lastActive}</td>
                  <td className="py-3">
                    {s.current ? (
                      <Badge variant="success" className="text-[10px]">Current</Badge>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600">Revoke</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortcut cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/settings" className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all group">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center"><Key className="h-5 w-5 text-orange-500" /></div>
          <div>
            <p className="font-medium text-gray-800 group-hover:text-orange-500">Change Password</p>
            <p className="text-xs text-gray-500">Update your account password</p>
          </div>
        </Link>
        <Link href="/2fa" className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all group">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center"><Shield className="h-5 w-5 text-blue-500" /></div>
          <div>
            <p className="font-medium text-gray-800 group-hover:text-orange-500">2FA Settings</p>
            <p className="text-xs text-gray-500">Configure two-factor authentication</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
