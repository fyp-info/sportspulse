import { notFound } from 'next/navigation'
import { Eye, Heart, Clock, User, Tag } from 'lucide-react'
import { mockPosts } from '@/lib/mock-data/posts'
import CommentSection from '@/components/blog/CommentSection'
import ArticleCard from '@/components/blog/ArticleCard'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

const sportVariants: Record<string, 'football' | 'basketball' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  Basketball: 'basketball',
  'Formula-1': 'formula-1',
  Cricket: 'cricket',
}

export default async function ArticlePage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const post = mockPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const related = mockPosts
    .filter((p) => p.sport === post.sport && p.id !== post.id && p.status === 'published')
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={sportVariants[post.sport]}>{post.sport}</Badge>
            <span className="text-gray-400 text-sm">{post.category}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 py-4 border-t border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {post.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> {post.likes.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Featured image placeholder */}
        <div className="h-64 rounded-2xl bg-linear-to-br from-orange-50 to-blue-50 border border-gray-100 flex items-center justify-center text-6xl mb-8">
          {post.sport === 'Football' ? '⚽' : post.sport === 'Basketball' ? '🏀' : post.sport === 'Formula-1' ? '🏎️' : '🏏'}
        </div>

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

        {/* Comments */}
        <CommentSection postId={post.id} />
      </div>

      {/* Related articles */}
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
