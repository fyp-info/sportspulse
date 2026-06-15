import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const patchSchema = z.object({
  status: z.enum(['approved', 'pending', 'rejected']).optional(),
  reported: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('moderator')
  if (error) return error
  const { id } = await params

  const parsed = patchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const exists = await prisma.comment.findUnique({ where: { id }, select: { id: true } })
  if (!exists) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  await prisma.comment.update({ where: { id }, data: parsed.data })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('moderator')
  if (error) return error
  const { id } = await params

  const exists = await prisma.comment.findUnique({ where: { id }, select: { id: true } })
  if (!exists) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

  await prisma.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
