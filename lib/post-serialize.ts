import type { Prisma } from '@prisma/client'

export const POST_INCLUDE = {
  author: { select: { username: true, name: true, email: true, role: true } },
  _count: { select: { comments: true } },
} as const

type PostWithRels = Prisma.PostGetPayload<{
  include: { author: { select: { username: true; name: true; email: true; role: true } }; _count: { select: { comments: true } } }
}>

export function serializePost(p: PostWithRels) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    sport: p.sport,
    category: p.category,
    author: p.author?.username ?? 'unknown',
    // Display name = full name when set, otherwise the username.
    authorName: (p.author?.name?.trim() || p.author?.username) ?? 'unknown',
    authorEmail: p.author?.email ?? '',
    authorRole: p.author?.role ?? 'user',
    publishedAt: (p.publishedAt ?? p.createdAt).toISOString().slice(0, 10),
    image: p.image,
    views: p.views,
    likes: p.likes,
    shares: p.shares,
    status: p.status,
    featured: p.featured,
    tags: p.tags,
    commentCount: p._count?.comments ?? 0,
  }
}
