import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/server'
import { publicUser } from '@/lib/http'
import { verifyOtp } from '@/lib/auth/email-code'

const schema = z.object({
  email: z.email(),
  code: z.string().min(4),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter your email and the 6-digit code.' }, { status: 400 })
  }
  const email = parsed.data.email.toLowerCase()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 })
  }

  // Verify the code unless the account is already verified (idempotent).
  if (!user.emailVerified) {
    const vt = await prisma.verificationToken.findFirst({
      where: { userId: user.id, type: 'email_verify' },
      orderBy: { createdAt: 'desc' },
    })
    if (!vt) {
      return NextResponse.json({ error: 'This code has expired. Request a new one.' }, { status: 400 })
    }
    const result = await verifyOtp(vt, parsed.data.code)
    if (result === 'expired') return NextResponse.json({ error: 'This code has expired. Request a new one.' }, { status: 400 })
    if (result === 'locked') return NextResponse.json({ error: 'Too many incorrect attempts. Please request a new code.' }, { status: 429 })
    if (result === 'invalid') return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 })

    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } })
    await prisma.verificationToken.deleteMany({ where: { userId: user.id, type: 'email_verify' } })
    user.emailVerified = true
  }

  // Only public members are auto-signed-in here; staff use their own portal.
  if (user.role === 'user') {
    await createSession(user, 'user')
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
    return NextResponse.json({ ok: true, user: publicUser(user) })
  }

  return NextResponse.json({ ok: true })
}
