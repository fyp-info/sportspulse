import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

// PATCH → mark a single notification read.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await authorize('user')
  if (error) return error
  const { id } = await params

  const n = await prisma.notification.findUnique({ where: { id }, select: { userId: true } })
  if (!n) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Only global or own notifications.
  if (n.userId && n.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.notification.update({ where: { id }, data: { read: true } })
  return NextResponse.json({ ok: true })
}
