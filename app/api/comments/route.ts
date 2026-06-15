import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { sanitizeText } from '@/lib/sanitize'
import type { Prisma } from '@prisma/client'

function serialize(c: Prisma.CommentGetPayload<{ include: { post: { select: { title: true; slug: true } } } }>) {
  return {
    id: c.id,
    postId: c.postId,
    postTitle: c.post?.title ?? '',
    postSlug: c.post?.slug ?? '',
    author: c.authorName,
    content: c.content,
    status: c.status,
    reported: c.reported,
    date: c.createdAt.toISOString().slice(0, 10),
  }
}

// GET ?postId=X            → public approved comments for a post
// GET ?status=pending|all  → moderation list (moderator+)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const postId = searchParams.get('postId')

  if (status) {
    const { error } = await authorize('moderator')
    if (error) return error
    const where: Prisma.CommentWhereInput = {}
    if (status !== 'all') where.status = status as 'pending' | 'approved' | 'rejected'
    if (postId) where.postId = postId
    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { post: { select: { title: true, slug: true } } },
    })
    return NextResponse.json({ comments: comments.map(serialize) })
  }

  // Public: approved comments for one post.
  if (!postId) return NextResponse.json({ comments: [] })
  const comments = await prisma.comment.findMany({
    where: { postId, status: 'approved' },
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { title: true, slug: true } } },
  })
  return NextResponse.json({ comments: comments.map(serialize) })
}

const createSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
})

export async function POST(request: Request) {
  const { user, error } = await authorize('user')
  if (error) return error

  const parsed = createSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const post = await prisma.post.findUnique({ where: { id: parsed.data.postId }, select: { id: true } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Strip any markup/control chars before storing (defence-in-depth vs stored XSS).
  const content = sanitizeText(parsed.data.content)
  if (!content) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      userId: user.id,
      authorName: user.username,
      content,
      status: 'pending', // awaits moderation
    },
    include: { post: { select: { title: true, slug: true } } },
  })

  return NextResponse.json({ comment: serialize(comment) }, { status: 201 })
}
