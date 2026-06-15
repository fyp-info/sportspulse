import Link from 'next/link'
import { Eye, Heart, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const sportVariants: Record<string, 'football' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  'Formula-1': 'formula-1',
  Cricket: 'cricket',
}

const sportEmoji: Record<string, string> = {
  Football: '⚽',
  'Formula-1': '🏎️',
  Cricket: '🏏',
}

export default async function TrendingGrid() {
  // Show the 4 most recently published posts from the DB (any sport, no featured filter).
  // This means any post published from the dashboard appears here immediately.
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  if (posts.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Trending Stories</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-4xl">📰</span>
          <p className="text-sm font-semibold text-gray-600">No stories published yet</p>
          <p className="text-xs text-gray-400">Publish articles from the dashboard to see them here</p>
        </div>
      </section>
    )
  }

  const displayPosts = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    sport: p.sport,
    category: p.category,
    image: p.image,
    featured: p.featured,
    views: p.views,
    likes: p.likes,
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
  }))

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Trending Stories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all"
          >
            {/* Image area */}
            <div className="h-44 relative overflow-hidden bg-gray-100">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full bg-linear-to-br from-orange-100 to-blue-50 flex items-center justify-center">
                  <span className="text-6xl opacity-30 select-none">{sportEmoji[post.sport] ?? '📰'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              {post.featured && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <div className="absolute bottom-3 left-3">
                <Badge variant={sportVariants[post.sport] ?? 'default'}>{post.sport}</Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1.5">{post.category} · {formatDate(post.publishedAt)}</p>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />5 min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
