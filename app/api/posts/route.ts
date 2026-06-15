import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { serializePost, POST_INCLUDE as INCLUDE } from '@/lib/post-serialize'
import { sanitizeLine, sanitizeText } from '@/lib/sanitize'
import type { Prisma } from '@prisma/client'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const sport = searchParams.get('sport')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const limit = Number(searchParams.get('limit') ?? 0)
  const mine = searchParams.get('mine') === 'true'
  const ids = searchParams.get('ids')?.split(',').filter(Boolean)

  // Shortcut: return a specific set of posts by id (used by bookmarks page)
  if (ids?.length) {
    const posts = await prisma.post.findMany({
      where: { id: { in: ids }, status: 'published' },
      include: INCLUDE,
    })
    return NextResponse.json({ posts: posts.map(serializePost) })
  }

  const where: Prisma.PostWhereInput = {}

  if (mine) {
    // Return all posts authored by the current staff user (any status).
    const { user, error } = await authorize('editor')
    if (error) return error
    where.authorId = user.id
  } else if (status === 'all' || status === 'draft') {
    // Listing non-published posts is staff-only.
    const { error } = await authorize('editor')
    if (error) return error
    if (status === 'draft') where.status = 'draft'
  } else {
    where.status = 'published'
  }
  if (sport) where.sport = sport
  if (featured === 'true') where.featured = true
  if (slug) where.slug = slug

  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: limit > 0 ? limit : undefined,
    include: INCLUDE,
  })

  return NextResponse.json({ posts: posts.map(serializePost) })
}

const createSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  sport: z.string().min(1),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.enum(['published', 'draft']).optional().default('published'),
})

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || 'post'
  let slug = root
  let n = 1
  while (await prisma.post.findUnique({ where: { slug } })) {
    n += 1
    slug = `${root}-${n}`
  }
  return slug
}

export async function POST(request: Request) {
  const { user, error } = await authorize('editor')
  if (error) return error

  const parsed = createSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = parsed.data
  const slug = await uniqueSlug(data.title)

  const post = await prisma.post.create({
    data: {
      slug,
      title: sanitizeLine(data.title),
      excerpt: sanitizeText(data.excerpt),
      content: sanitizeText(data.content),
      sport: data.sport,
      category: sanitizeLine(data.category),
      image: data.image,
      tags: data.tags,
      featured: data.featured,
      status: data.status,
      publishedAt: data.status === 'published' ? new Date() : null,
      authorId: user.id,
    },
    include: INCLUDE,
  })

  // Broadcast a notification when a post goes live.
  if (data.status === 'published') {
    await prisma.notification.create({
      data: {
        category: 'blog',
        title: 'New Article Published',
        body: `"${post.title}" is now live.`,
        href: `/blog/${post.slug}`,
      },
    })
  }

  return NextResponse.json({ post: serializePost(post) }, { status: 201 })
}
