import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { issueEmailVerificationCode } from '@/lib/auth/email-code'

const schema = z.object({ email: z.email() })

// (Re)send an email-verification code. Always responds 200 so it doesn't reveal
// whether an account exists.
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ ok: true })

  const email = parsed.data.email.toLowerCase()
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerified: true } })
  if (user && !user.emailVerified) {
    await issueEmailVerificationCode(user.id, email)
  }
  return NextResponse.json({ ok: true })
}
