'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { useUserAuth } from '@/lib/store/auth-store'
import { cn } from '@/lib/utils'

interface Props {
  postId: string
  initialBookmarked?: boolean
  initialCount?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}

export default function BookmarkButton({
  postId,
  initialBookmarked = false,
  initialCount = 0,
  size = 'md',
  showCount = true,
}: Props) {
  const router = useRouter()
  const { isAuthenticated, user, loading: authLoading } = useUserAuth()
  const isPublicUser = isAuthenticated && user?.role === 'user'

  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState('')

  const flash = (msg: string) => {
    setHint(msg)
    setTimeout(() => setHint(''), 2500)
  }

  // Hydrate the real count + this user's bookmark state from the server.
  useEffect(() => {
    let cancelled = false
    fetch(`/api/bookmarks/status?postId=${postId}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (typeof d.count === 'number') setCount(d.count)
        setBookmarked(!!d.bookmarked)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [postId, isPublicUser])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Auth store still hydrating — wait a beat rather than misfire.
    if (authLoading) return

    // Logged-out (or staff on the public site) → nudge to sign in.
    if (!isPublicUser) {
      flash('Please log in first')
      setTimeout(() => router.push('/login'), 800)
      return
    }

    if (loading) return
    setLoading(true)
    const next = !bookmarked
    setBookmarked(next)
    setCount((c) => Math.max(0, c + (next ? 1 : -1))) // optimistic
    try {
      const res = await fetch('/api/bookmarks', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setBookmarked(!next)
        setCount((c) => Math.max(0, c + (next ? -1 : 1)))
        flash(j.error ? `Couldn't save: ${j.error}` : "Couldn't save — try again")
      }
    } catch {
      setBookmarked(!next)
      setCount((c) => Math.max(0, c + (next ? -1 : 1)))
      flash('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={toggle}
        disabled={loading}
        title={isPublicUser ? (bookmarked ? 'Remove bookmark' : 'Bookmark') : 'Log in to bookmark'}
        className={cn(
          'flex items-center gap-1 transition-colors',
          bookmarked ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500',
          loading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Bookmark className={cn(iconSize, bookmarked && 'fill-orange-500')} />
        {showCount && <span className="text-xs font-medium tabular-nums">{count.toLocaleString()}</span>}
      </button>

      {hint && (
        <span className="absolute bottom-full right-0 mb-1.5 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg z-10">
          {hint}
        </span>
      )}
    </span>
  )
}
