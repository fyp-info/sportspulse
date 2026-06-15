import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth/server'
import { sendLoginCodeEmail } from '@/lib/email'

// Step 1 of a code-gated login (superadmin OR staff): verify credentials,
// email a 6-digit code, return a challenge id. No session is created yet.
const schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  scope: z.enum(['staff', 'superadmin']).optional().default('superadmin'),
})

// Which roles each portal admits.
const SCOPE_ROLES: Record<string, string[]> = {
  staff: ['editor', 'moderator', 'admin'],
  superadmin: ['superadmin'],
}
const SCOPE_REJECT: Record<string, string> = {
  staff: 'No staff account found with those credentials.',
  superadmin: 'This portal is for the Super Admin only.',
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const identifier = parsed.data.identifier.trim()
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier.toLowerCase() }, { username: identifier }] },
  })

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const scope = parsed.data.scope
  if (!SCOPE_ROLES[scope].includes(user.role)) {
    return NextResponse.json({ error: SCOPE_REJECT[scope] }, { status: 403 })
  }
  if (!user.isActive) {
    return NextResponse.json({ error: 'Your account has been disabled' }, { status: 403 })
  }

  // Clear prior pending challenges, then issue a fresh one.
  await prisma.verificationToken.deleteMany({ where: { userId: user.id, type: 'two_factor' } })

  const code = String(Math.floor(100000 + Math.random() * 900000)) // 6 digits
  const challengeId = crypto.randomUUID()
  await prisma.verificationToken.create({
    data: {
      token: challengeId,
      otp: await bcrypt.hash(code, 10),
      type: 'two_factor',
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
    },
  })

  await sendLoginCodeEmail(user.email, code)

  return NextResponse.json({ challengeId })
}
