'use client'

import { useAuthStore } from '@/lib/store/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { loginHistory } from '@/lib/mock-data/users'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="space-y-6">
        {/* Avatar + basic info */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-orange-100 text-orange-600 text-2xl font-bold flex items-center justify-center shrink-0">
            {user?.username?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{user?.username}</div>
            <div className="text-gray-500 text-sm">{user?.email}</div>
            <Badge variant="default" className="capitalize mt-1.5">{user?.role}</Badge>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">Change Avatar</Button>
        </div>

        {/* Edit info */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Profile Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Username</Label><Input defaultValue={user?.username} /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue={user?.email} /></div>
          </div>
          <div className="space-y-2"><Label>Bio</Label><Textarea defaultValue={user?.bio} rows={3} /></div>
          <Button variant="primary">Save Changes</Button>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Change Password</h3>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
            <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
            <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" placeholder="••••••••" /></div>
          </div>
          <Button variant="primary">Update Password</Button>
        </div>

        {/* Login history */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Login History</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Date', 'IP', 'Device', 'Location', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-xs">{row.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.ip}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{row.device}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{row.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.status === 'success' ? 'success' : 'destructive'} className="text-[10px] capitalize">{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
