import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const schema = z.object({ code: z.string().min(4) })

// Confirm the emailed code and turn 2FA on for the signed-in user.
export async function POST(request: Request) {
  const { user, error } = await authorize('user')
  if (error) return error

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Enter the 6-digit code.' }, { status: 400 })

  const vt = await prisma.verificationToken.findFirst({
    where: { userId: user.id, type: 'two_factor' },
    orderBy: { createdAt: 'desc' },
  })
  if (!vt || !vt.otp || vt.expiresAt < new Date()) {
    return NextResponse.json({ error: 'This code has expired. Please try again.' }, { status: 400 })
  }
  if (!(await bcrypt.compare(parsed.data.code, vt.otp))) {
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } })
  await prisma.verificationToken.deleteMany({ where: { userId: user.id, type: 'two_factor' } })

  return NextResponse.json({ ok: true })
}
