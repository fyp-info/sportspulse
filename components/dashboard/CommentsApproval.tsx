'use client'

import { useState, useEffect } from 'react'
import { Check, X, MessageSquare, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Status = 'approved' | 'pending' | 'rejected'

interface Row {
  id: string
  postId: string
  postTitle: string
  author: string
  content: string
  date: string
  status: Status
  reported: boolean
}

export default function CommentsApproval() {
  const [comments, setComments] = useState<Row[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/comments?status=all', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setComments(d.comments ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const postTitle = (row: Row) => row.postTitle || 'Unknown post'

  const setStatus = (id: string, status: Status) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {})
  }

  const remove = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
    fetch(`/api/comments/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const pending = comments.filter((c) => c.status === 'pending')
  const approved = comments.filter((c) => c.status === 'approved').length
  const rejected = comments.filter((c) => c.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve comments submitted by users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{approved}</p>
            <p className="text-xs text-gray-400">Approved</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{rejected}</p>
            <p className="text-xs text-gray-400">Rejected</p>
          </div>
        </div>
      </div>

      {/* Pending approval queue */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Approval ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            No comments waiting for approval.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {c.author.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{c.author}</span>
                    {c.reported && <Badge variant="destructive" className="text-[10px]">Reported</Badge>}
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1.5">on <span className="text-gray-500">{postTitle(c)}</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => setStatus(c.id, 'approved')}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setStatus(c.id, 'rejected')}
                  >
                    <X className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All comments */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">All Comments</h3>
        <div className="space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                {c.author.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800">{c.author}</span>
                <p className="text-xs text-gray-500 truncate">{c.content}</p>
              </div>
              <Badge
                variant={c.status === 'approved' ? 'success' : c.status === 'rejected' ? 'destructive' : 'warning'}
                className="capitalize shrink-0"
              >
                {c.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => remove(c.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
