import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/server'
import { verifyOtp } from '@/lib/auth/email-code'

const schema = z.object({
  challengeId: z.string().min(1),
  code: z.string().length(6, 'Enter the 6-digit code'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { challengeId, code, password } = parsed.data
  const vt = await prisma.verificationToken.findUnique({ where: { token: challengeId } })

  if (!vt || vt.type !== 'password_reset') {
    return NextResponse.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 })
  }

  const result = await verifyOtp(vt, code)
  if (result === 'expired') return NextResponse.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 })
  if (result === 'locked') return NextResponse.json({ error: 'Too many incorrect attempts. Please request a new code.' }, { status: 429 })
  if (result === 'invalid') return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 401 })

  const passwordHash = await hashPassword(password)
  await prisma.user.update({ where: { id: vt.userId }, data: { passwordHash } })
  await prisma.verificationToken.delete({ where: { id: vt.id } })

  return NextResponse.json({ ok: true })
}
