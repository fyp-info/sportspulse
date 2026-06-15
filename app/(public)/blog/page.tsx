'use client'

import { useState, useEffect } from 'react'
import ArticleCard from '@/components/blog/ArticleCard'
import ArticleFilter from '@/components/blog/ArticleFilter'
import type { Post } from '@/lib/mock-data/posts'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/posts', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        setPosts(d.posts ?? [])
        setFiltered(d.posts ?? [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const handleFilter = ({ sport, search }: { sport: string; search: string }) => {
    setFiltered(
      posts.filter((p) => {
        const matchSport = sport === 'All' || p.sport === sport
        const matchSearch =
          !search ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(search.toLowerCase())
        return matchSport && matchSearch
      }),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-500">Expert analysis, match reports, and breaking sports news.</p>
      </div>

      <div className="mb-6">
        <ArticleFilter onFilter={handleFilter} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center text-gray-400">
          No articles found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => <ArticleCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
