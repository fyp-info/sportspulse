import Link from 'next/link'
import { Eye, Clock, User } from 'lucide-react'
import type { Post } from '@/lib/mock-data/posts'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import BookmarkButton from './BookmarkButton'

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

interface Props {
  post: Post
  variant?: 'default' | 'compact'
  isBookmarked?: boolean
}

export default function ArticleCard({ post, variant = 'default', isBookmarked = false }: Props) {
  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:border-orange-200 hover:shadow-sm transition-all">
        <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
          {post.image ? (
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-orange-50 to-blue-50 flex items-center justify-center text-2xl">
              {sportEmoji[post.sport]}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Badge variant={sportVariants[post.sport]} className="text-[10px] mb-1">{post.sport}</Badge>
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">{post.title}</h4>
          <p className="text-xs text-gray-400 mt-1">{formatDate(post.publishedAt)}</p>
        </div>
        <div className="shrink-0 self-start pt-1">
          <BookmarkButton postId={post.id} initialBookmarked={isBookmarked} size="sm" />
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-orange-200 hover:shadow-md transition-all">
      {/* Image */}
      <div className="h-44 relative overflow-hidden bg-gray-100">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full bg-linear-to-br from-orange-50 to-blue-50 flex items-center justify-center border-b border-gray-100">
            <span className="text-5xl opacity-40 select-none">{sportEmoji[post.sport]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        {post.featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-orange-500 text-white px-2 py-0.5 rounded-full">Featured</span>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge variant={sportVariants[post.sport]}>{post.sport}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400">{post.category}</span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.authorName || post.author}
            <span className="mx-1.5">·</span>
            <Clock className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views.toLocaleString()}</span>
            <BookmarkButton postId={post.id} initialBookmarked={isBookmarked} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  )
}
