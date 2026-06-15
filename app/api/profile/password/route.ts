import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { hashPassword, verifyPassword } from '@/lib/auth/server'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export async function POST(request: Request) {
  const { user, error } = await authorize('user')
  if (error) return error

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } })
  if (!dbUser || !(await verifyPassword(parsed.data.currentPassword, dbUser.passwordHash))) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  })

  return NextResponse.json({ ok: true })
}
