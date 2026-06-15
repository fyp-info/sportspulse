import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

// Turn 2FA off for the signed-in user.
export async function POST() {
  const { user, error } = await authorize('user')
  if (error) return error

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false } })
  await prisma.verificationToken.deleteMany({ where: { userId: user.id, type: 'two_factor' } })

  return NextResponse.json({ ok: true })
}
