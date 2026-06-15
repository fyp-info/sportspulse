import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { issuePasswordResetCode } from '@/lib/auth/email-code'

const schema = z.object({ email: z.email() })

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  // Always respond 200 so we don't reveal whether an email exists.
  if (!parsed.success) return NextResponse.json({ ok: true })

  const email = parsed.data.email.toLowerCase()
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isActive: true },
  })

  // Any active account (members AND staff/superadmin) can reset via an emailed
  // code. We email the code to the account's own registered address.
  if (user && user.isActive) {
    const challengeId = await issuePasswordResetCode(user.id, email)
    return NextResponse.json({ ok: true, challengeId })
  }

  return NextResponse.json({ ok: true })
}
