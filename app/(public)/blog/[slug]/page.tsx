import { notFound } from 'next/navigation'
import { Eye, Clock, User, Tag } from 'lucide-react'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import CommentSection from '@/components/blog/CommentSection'
import ArticleCard from '@/components/blog/ArticleCard'
import BookmarkButton from '@/components/blog/BookmarkButton'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/mock-data/posts'
import ViewTracker from '@/components/blog/ViewTracker'

const sportVariants: Record<string, 'football' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  'Formula-1': 'formula-1',
  Cricket: 'cricket',
}

const sportEmoji: Record<string, string> = { Football: '⚽', 'Formula-1': '🏎️', Cricket: '🏏' }

type DbPost = Prisma.PostGetPayload<{ include: { author: { select: { username: true; name: true } } } }>

function toCard(p: DbPost): Post {
  const username = p.author?.username ?? 'unknown'
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    sport: p.sport as Post['sport'],
    category: p.category,
    author: username,
    authorName: (p.author?.name?.trim() || username),
    authorEmail: '',
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
    image: p.image,
    views: p.views,
    likes: p.likes,
    shares: p.shares,
    status: p.status as Post['status'],
    featured: p.featured,
    tags: p.tags,
  }
}

export default async function ArticlePage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params

  const dbPost = await prisma.post.findFirst({
    where: { slug, status: 'published' },
    include: { author: { select: { username: true, name: true } } },
  })
  if (!dbPost) notFound()
  const post = toCard(dbPost)

  const relatedRaw = await prisma.post.findMany({
    where: { sport: post.sport, status: 'published', NOT: { id: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { author: { select: { username: true, name: true } } },
  })
  const related: Post[] = relatedRaw.map(toCard)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookmarkModel = (prisma as any).bookmark
  const bookmarkCount = bookmarkModel ? await bookmarkModel.count({ where: { postId: post.id } }) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Increment view count client-side on first mount */}
      <ViewTracker postId={post.id} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={sportVariants[post.sport]}>{post.sport}</Badge>
            <span className="text-gray-400 text-sm">{post.category}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400 py-4 border-t border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.authorName || post.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {post.views.toLocaleString()} views</span>
            </div>
            <BookmarkButton postId={post.id} initialCount={bookmarkCount} />
          </div>
        </div>

        {/* Featured image */}
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-2xl border border-gray-100 mb-8" />
        ) : (
          <div className="h-64 rounded-2xl bg-linear-to-br from-orange-50 to-blue-50 border border-gray-100 flex items-center justify-center text-6xl mb-8">
            {sportEmoji[post.sport]}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-slate max-w-none mb-8">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
          <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 py-4 border-t border-b border-gray-200 mb-8">
          <span className="text-sm text-gray-500">Share:</span>
          {['Twitter', 'Facebook', 'WhatsApp'].map((s) => (
            <button key={s} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs hover:bg-orange-50 hover:text-orange-500 transition-colors">
              {s}
            </button>
          ))}
        </div>

        <CommentSection postId={post.id} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => <ArticleCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
