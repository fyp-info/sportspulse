'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import { useUserAuth } from '@/lib/store/auth-store'
import ArticleCard from '@/components/blog/ArticleCard'
import type { Post } from '@/lib/mock-data/posts'

export default function BookmarksPage() {
  const { isAuthenticated, user } = useUserAuth()
  const isPublicUser = isAuthenticated && user?.role === 'user'

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPublicUser) { setLoading(false); return }

    // First fetch bookmarked postIds, then fetch each post
    fetch('/api/bookmarks')
      .then((r) => r.json())
      .then(async (d) => {
        const ids: string[] = d.postIds ?? []
        if (!ids.length) { setLoading(false); return }
        const res = await fetch(`/api/posts?ids=${ids.join(',')}`)
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        const postMap = new Map<string, Post>((data.posts ?? []).map((p: Post) => [p.id, p]))
        // Preserve bookmark order
        setPosts(ids.map((id) => postMap.get(id)).filter(Boolean) as Post[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isPublicUser])

  if (!isPublicUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Bookmarks</h1>
        <p className="text-gray-500 mb-6">Sign in to save and access your bookmarked articles.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Bookmark className="h-6 w-6 text-orange-500" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bookmarks</h1>
          <p className="text-gray-500 text-sm mt-0.5">Articles you&apos;ve saved for later</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-16 text-center">
          <Bookmark className="h-10 w-10 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No bookmarks yet</p>
          <p className="text-gray-400 text-sm mt-1">Tap the bookmark icon on any article to save it here.</p>
          <Link href="/blog" className="inline-flex mt-5 items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            Browse Articles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <ArticleCard key={p.id} post={p} isBookmarked />
          ))}
        </div>
      )}
    </div>
  )
}
