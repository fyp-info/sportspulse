'use client'

import { useState } from 'react'
import { Send, MessageSquare, Lock } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { mockComments } from '@/lib/mock-data/posts'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

interface Props {
  postId: string
}

export default function CommentSection({ postId }: Props) {
  const { user, isAuthenticated } = useAuthStore()
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const comments = mockComments.filter((c) => c.postId === postId && c.status === 'approved')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitted(true)
    setComment('')
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900">Comments ({comments.length})</h3>
      </div>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {submitted && (
            <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3">
              Your comment has been submitted for review.
            </div>
          )}
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Commenting as <span className="text-gray-700 font-medium">{user?.username}</span></span>
            <Button type="submit" size="sm" variant="primary" disabled={!comment.trim()}>
              <Send className="h-4 w-4" /> Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex items-center gap-4">
          <Lock className="h-8 w-8 text-gray-300 shrink-0" />
          <div>
            <p className="text-gray-900 font-medium">Sign in to join the discussion</p>
            <p className="text-sm text-gray-500 mt-1">
              <Link href="/login" className="text-orange-500 hover:underline">Login</Link> or{' '}
              <Link href="/register" className="text-orange-500 hover:underline">register</Link> to post a comment.
            </p>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold shrink-0">
              {c.author.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{c.author}</span>
                <span className="text-xs text-gray-400">{c.date}</span>
              </div>
              <p className="text-sm text-gray-600">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
