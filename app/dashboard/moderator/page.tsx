'use client'

import { MessageSquare, Flag, UserX, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockComments } from '@/lib/mock-data/posts'

export default function ModeratorDashboard() {
  const pending = mockComments.filter((c) => c.status === 'pending')
  const reported = mockComments.filter((c) => c.reported)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderator Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Keep the community safe and respectful</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Pending Comments" value={pending.length} icon={MessageSquare} color="text-yellow-500" />
        <StatCard title="Reported Content" value={reported.length} icon={Flag} color="text-red-500" />
        <StatCard title="Approved Today" value="28" icon={CheckCircle} change={5} color="text-green-600" />
        <StatCard title="Users Banned" value="3" icon={UserX} color="text-red-500" />
      </div>

      {/* Pending Comments Queue */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Pending Comments ({pending.length})</h3>
          <Button variant="secondary" size="sm">Approve All</Button>
        </div>
        <div className="space-y-3">
          {pending.map((c) => (
            <div key={c.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{c.author}</span>
                  {c.reported && <Badge variant="destructive" className="text-[10px]">Reported</Badge>}
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
                <p className="text-sm text-gray-600">{c.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="ghost" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reported Content */}
      {reported.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Reported Content ({reported.length})</h3>
          </div>
          <div className="space-y-3">
            {reported.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-red-200">
                <div className="h-8 w-8 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center shrink-0">
                  {c.author.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-800">{c.author}</span>
                  <p className="text-sm text-gray-600 mt-1">{c.content}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="destructive" className="h-8 text-xs">Remove</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-red-500">Ban User</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moderation Activity Log */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Moderation Activity</h3>
        <div className="space-y-2">
          {[
            { action: 'Approved 12 comments', time: '10 minutes ago', dot: 'bg-green-400' },
            { action: 'Rejected 2 spam comments', time: '1 hour ago', dot: 'bg-yellow-400' },
            { action: 'Banned user "spam_bot_99"', time: '3 hours ago', dot: 'bg-red-400' },
            { action: 'Approved 8 comments', time: 'Yesterday', dot: 'bg-green-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                <span className="text-sm text-gray-700">{item.action}</span>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
