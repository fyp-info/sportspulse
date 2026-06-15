import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession } from '@/lib/auth/server'
import { issueLoginCode, issueEmailVerificationCode } from '@/lib/auth/email-code'
import { getClientInfo, publicUser } from '@/lib/http'
import { geolocateIp, type GeoInfo } from '@/lib/geoip'
import { audit } from '@/lib/audit'

const schema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  scope: z.enum(['user', 'staff', 'superadmin']).optional(),
})

// Which roles each login entrance admits.
const SCOPE_ROLES: Record<string, string[]> = {
  user: ['user'],
  staff: ['editor', 'moderator', 'admin'],
  superadmin: ['superadmin'],
}

const SCOPE_REJECT: Record<string, string> = {
  user: 'Staff accounts must sign in through the staff portal.',
  staff: 'No staff account found with those credentials.',
  superadmin: 'This portal is for the Super Admin only.',
}

async function isIpBlocked(ip: string): Promise<boolean> {
  if (ip === 'unknown') return false
  const manual = await prisma.blockedIp.findUnique({ where: { ip } })
  if (manual) return true
  const auto = await prisma.failedLogin.findFirst({ where: { ip, blocked: true } })
  return !!auto
}

async function recordFailedAttempt(ip: string, geo: GeoInfo) {
  if (ip === 'unknown') return
  const existing = await prisma.failedLogin.findFirst({ where: { ip } })
  if (existing) {
    const newAttempts = existing.attempts + 1
    const nowBlocked = newAttempts >= 5
    await prisma.failedLogin.update({
      where: { id: existing.id },
      data: { attempts: newAttempts, lastAttempt: new Date(), blocked: nowBlocked, country: geo.country },
    })
    // When the IP crosses the threshold, surface it in the SuspiciousIp table
    // so it appears in the superadmin security dashboards with real location.
    if (nowBlocked) {
      const susp = await prisma.suspiciousIp.findFirst({ where: { ip } })
      if (susp) {
        await prisma.suspiciousIp.update({
          where: { id: susp.id },
          data: {
            status: 'blocked', threat: 'high', attempts: newAttempts, lastSeen: new Date(),
            country: geo.country, city: geo.city, network: geo.network,
          },
        })
      } else {
        await prisma.suspiciousIp.create({
          data: { ip, status: 'blocked', threat: 'high', attempts: newAttempts, country: geo.country, city: geo.city, network: geo.network },
        })
      }
    }
  } else {
    await prisma.failedLogin.create({ data: { ip, attempts: 1, country: geo.country } })
  }
}

async function clearFailedAttempts(ip: string) {
  if (ip === 'unknown') return
  await prisma.failedLogin.deleteMany({ where: { ip } })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const identifier = parsed.data.identifier.trim()
  const { ip: rawIp, device } = getClientInfo(request)

  // Resolve a canonical, geolocatable IP. Local/proxy addresses (e.g. 127.0.0.1
  // in dev) resolve to this machine's real public IP, so security dashboards
  // show the actual country / city / network instead of "Localhost". In
  // production the captured IP is already public, so this is a no-op.
  const geo = await geolocateIp(rawIp)
  const ip = geo.ip || rawIp

  // Reject blocked IPs before doing any further work.
  if (await isIpBlocked(ip)) {
    await audit({ actor: identifier, action: 'Login blocked — IP is banned', target: 'auth/login', ip, category: 'access_denied', status: 'blocked' })
    return NextResponse.json(
      { error: 'Your IP has been blocked due to too many failed login attempts. Please contact support.' },
      { status: 429 },
    )
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier.toLowerCase() }, { username: identifier }] },
  })

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    await recordFailedAttempt(ip, geo)
    await audit({ actor: identifier, action: 'Failed login attempt — wrong credentials', target: 'auth/login', ip, category: 'failed_login', status: 'failed' })
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  // Password is correct — reset the consecutive-failure counter for this IP.
  await clearFailedAttempts(ip)

  if (!user.isActive) {
    return NextResponse.json({ error: 'Your account has been disabled' }, { status: 403 })
  }

  // Enforce that this login entrance admits the user's role.
  // For the public user portal (scope='user') we deliberately return the same
  // generic message as a bad password — revealing that a staff account exists
  // at a given email is a security leak. Staff portals keep their specific
  // messages because staff already know which portal they're using.
  const scope = parsed.data.scope
  if (scope && !SCOPE_ROLES[scope].includes(user.role)) {
    if (scope === 'user') {
      await recordFailedAttempt(ip, geo)
      await audit({ actor: identifier, action: 'Failed login attempt — wrong credentials', target: 'auth/login', ip, category: 'failed_login', status: 'failed' })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    await audit({ actor: identifier, action: `Portal mismatch — ${user.role} tried ${scope} portal`, target: 'auth/login', ip, category: 'access_denied', status: 'denied' })
    return NextResponse.json({ error: SCOPE_REJECT[scope] }, { status: 403 })
  }

  // Require a verified email before issuing any session. Unverified members get
  // a fresh 6-digit code by email and must confirm it (no link, no nag banner).
  if (!user.emailVerified && user.role === 'user') {
    await issueEmailVerificationCode(user.id, user.email)
    await audit({ actor: user.username, action: 'Email verification required at login', target: 'auth/login', ip, category: 'login', status: 'success' })
    return NextResponse.json({ needsVerification: true, email: user.email })
  }

  // If 2FA is on, check whether the user still has grace logins remaining.
  // After a successful 2FA verification the counter is set to 3, and each
  // subsequent login without 2FA decrements it until it reaches 0.
  if (user.twoFactorEnabled) {
    if (user.twoFactorGraceRemaining > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorGraceRemaining: { decrement: 1 } },
      })
    } else {
      const challengeId = await issueLoginCode(user.id, user.email)
      await audit({ actor: user.username, action: '2FA challenge issued', target: 'auth/2fa', ip, category: '2fa', status: 'success' })
      return NextResponse.json({ twoFactor: true, challengeId })
    }
  }

  // Public 'user' scope → member session; staff portals → staff session.
  const realm = scope === 'user' || user.role === 'user' ? 'user' : 'staff'
  await createSession(user, realm)
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
  const location = [geo.city, geo.country].filter(Boolean).join(', ')
  await prisma.loginHistory.create({
    data: { userId: user.id, ip, device, location, status: 'success' },
  })
  await audit({ actor: user.username, action: `Login (${realm} session)`, target: `auth/login — role:${user.role}`, ip, category: 'login', status: 'success' })

  return NextResponse.json({ user: publicUser(user) })
}
