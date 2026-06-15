'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send, MessageSquare, Lock } from 'lucide-react'
import { useUserAuth } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

interface Props {
  postId: string
}

interface ApiComment {
  id: string
  author: string
  content: string
  date: string
}

export default function CommentSection({ postId }: Props) {
  const { user, isAuthenticated } = useUserAuth()
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [comments, setComments] = useState<ApiComment[]>([])

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
      const json = await res.json()
      if (res.ok) setComments(json.comments ?? [])
    } catch {
      /* ignore */
    }
  }, [postId])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: comment }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Could not post comment')
        return
      }
      setComment('')
      setSubmitted(true) // pending moderation — not shown until approved
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
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
            <Button type="submit" size="sm" variant="primary" disabled={!comment.trim() || submitting}>
              <Send className="h-4 w-4" /> {submitting ? 'Posting…' : 'Post Comment'}
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
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts.</p>
        )}
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
