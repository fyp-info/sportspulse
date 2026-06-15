import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { canManageRole, type Role } from '@/lib/auth/roles'
import { serializePost, POST_INCLUDE as INCLUDE } from '@/lib/post-serialize'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  sport: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['published', 'draft']).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await authorize('editor')
  if (error) return error
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { role: true } } },
  })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // You may edit your own post, or one whose author holds a strictly junior
  // role (superadmin → anyone, admin → moderator/editor, moderator → editor).
  const isOwner = post.authorId === user.id
  const authorRole = (post.author?.role ?? 'user') as Role
  if (!isOwner && !canManageRole(user.role as Role, authorRole)) {
    return NextResponse.json({ error: 'You can only edit your own posts or those of a more junior role' }, { status: 403 })
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const justPublished = parsed.data.status === 'published' && post.status !== 'published'

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(justPublished ? { publishedAt: new Date() } : {}),
    },
    include: INCLUDE,
  })

  return NextResponse.json({ post: serializePost(updated) })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await authorize('editor')
  if (error) return error
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { role: true } } },
  })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Same seniority rule as edit: own post, or an author of a junior role.
  const isOwner = post.authorId === user.id
  const authorRole = (post.author?.role ?? 'user') as Role
  if (!isOwner && !canManageRole(user.role as Role, authorRole)) {
    return NextResponse.json({ error: 'You can only delete your own posts or those of a more junior role' }, { status: 403 })
  }

  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
