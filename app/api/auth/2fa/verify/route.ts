import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/server'
import { getClientInfo, publicUser } from '@/lib/http'
import { geolocateIp } from '@/lib/geoip'
import { audit } from '@/lib/audit'
import { verifyOtp } from '@/lib/auth/email-code'

// Step 2 of superadmin login: validate the emailed code, then create the session.
const schema = z.object({
  challengeId: z.string().min(1),
  code: z.string().min(4),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const challenge = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.challengeId },
    include: { user: true },
  })

  const { ip: rawIp, device } = getClientInfo(request)
  const geo = await geolocateIp(rawIp)
  const ip = geo.ip || rawIp

  if (!challenge || challenge.type !== 'two_factor') {
    await audit({ actor: 'unknown', action: '2FA verification failed — code expired or invalid', target: 'auth/2fa/verify', ip, category: '2fa', status: 'failed' })
    return NextResponse.json({ error: 'This code has expired. Please sign in again.' }, { status: 400 })
  }

  const result = await verifyOtp(challenge, parsed.data.code)
  if (result === 'expired') {
    await audit({ actor: challenge.user.username, action: '2FA verification failed — code expired', target: 'auth/2fa/verify', ip, category: '2fa', status: 'failed' })
    return NextResponse.json({ error: 'This code has expired. Please sign in again.' }, { status: 400 })
  }
  if (result === 'locked') {
    await audit({ actor: challenge.user.username, action: '2FA locked — too many wrong codes', target: 'auth/2fa/verify', ip, category: '2fa', status: 'blocked' })
    return NextResponse.json({ error: 'Too many incorrect attempts. Please sign in again.' }, { status: 429 })
  }
  if (result === 'invalid') {
    await audit({ actor: challenge.user.username, action: '2FA verification failed — wrong code', target: 'auth/2fa/verify', ip, category: '2fa', status: 'failed' })
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 401 })
  }

  const user = challenge.user
  // Single-use: consume the challenge.
  await prisma.verificationToken.delete({ where: { id: challenge.id } })

  // Grant 3 grace logins so the next 3 login/logout cycles skip 2FA.
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorGraceRemaining: 3 },
  })

  // Members get a member session; staff get a staff session.
  const realm = user.role === 'user' ? 'user' : 'staff'
  await createSession(user, realm)
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
  const location = [geo.city, geo.country].filter(Boolean).join(', ')
  await prisma.loginHistory.create({
    data: { userId: user.id, ip, device, location, status: 'success' },
  })
  await audit({ actor: user.username, action: '2FA verification succeeded — session created', target: `auth/2fa/verify — role:${user.role}`, ip, category: '2fa', status: 'success' })

  return NextResponse.json({ user: publicUser(user) })
}
