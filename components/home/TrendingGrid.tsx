import Link from 'next/link'
import { Eye, Heart, Clock } from 'lucide-react'
import { mockPosts } from '@/lib/mock-data/posts'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const sportVariants: Record<string, 'football' | 'basketball' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  Basketball: 'basketball',
  'Formula-1': 'formula-1',
  Cricket: 'cricket',
}

const sportEmoji: Record<string, string> = {
  Football: '⚽',
  Basketball: '🏀',
  'Formula-1': '🏎️',
  Cricket: '🏏',
}

export default function TrendingGrid() {
  const published = mockPosts.filter((p) => p.featured && p.status === 'published')
  const pick = (sport: string) => published.find((p) => p.sport === sport)
  const featured = [
    pick('Football'),
    pick('Formula-1'),
    pick('Cricket'),
    pick('Basketball'),
  ].filter(Boolean) as typeof published

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Trending Stories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featured.map((post) => (
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
                  <span className="text-6xl opacity-30 select-none">{sportEmoji[post.sport]}</span>
                </div>
              )}
              {/* Gradient overlay so badge is always readable */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              {post.featured && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <div className="absolute bottom-3 left-3">
                <Badge variant={sportVariants[post.sport]}>{post.sport}</Badge>
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
