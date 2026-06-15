// Node-only auth helpers (Prisma + bcrypt + cookie jar). Never import from proxy.ts.
import 'server-only'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  signSession,
  verifySession,
  REALM_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
  type AuthRealm,
} from './jwt'
import type { Role } from './roles'

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

type SessionUser = { id: string; username: string; email: string; role: Role }

export async function createSession(user: SessionUser, realm: AuthRealm): Promise<void> {
  const token = await signSession({
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  })
  const jar = await cookies()
  jar.set(REALM_COOKIE[realm], token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession(realm: AuthRealm): Promise<void> {
  const jar = await cookies()
  jar.delete(REALM_COOKIE[realm])
}

export async function getSessionPayload(realm: AuthRealm): Promise<SessionPayload | null> {
  const jar = await cookies()
  const token = jar.get(REALM_COOKIE[realm])?.value
  if (!token) return null
  return verifySession(token)
}

const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  bio: true,
  emailVerified: true,
  twoFactorEnabled: true,
  isActive: true,
} as const

/** Returns the fresh DB user for the given realm's session, or null. */
export async function getCurrentUser(realm: AuthRealm) {
  const payload = await getSessionPayload(realm)
  if (!payload) return null
  // Reject tokens that were revoked (e.g. on logout) even if still unexpired.
  if (payload.jti && (await isTokenRevoked(payload.jti))) return null
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: PUBLIC_USER_SELECT,
  })
  if (!user || !user.isActive) return null
  return user
}

/** True if this token id has been added to the server-side denylist. */
export async function isTokenRevoked(jti: string): Promise<boolean> {
  const row = await prisma.revokedToken.findUnique({ where: { jti } })
  return !!row
}

/** Add a token id to the denylist until its natural expiry. */
export async function revokeToken(jti: string, expiresAt: Date): Promise<void> {
  try {
    await prisma.revokedToken.create({ data: { jti, expiresAt } })
  } catch {
    // already revoked — ignore the unique-constraint error
  }
  // Opportunistically prune entries that have expired anyway.
  prisma.revokedToken.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {})
}

/** Revoke the current realm's token (call on logout) before clearing the cookie. */
export async function revokeCurrentSession(realm: AuthRealm): Promise<void> {
  const jar = await cookies()
  const token = jar.get(REALM_COOKIE[realm])?.value
  if (!token) return
  const payload = await verifySession(token)
  if (payload?.jti && payload.exp) {
    await revokeToken(payload.jti, new Date(payload.exp * 1000))
  }
}

/** Throws if not authenticated in the given realm. */
export async function requireUser(realm: AuthRealm) {
  const user = await getCurrentUser(realm)
  if (!user) throw new AuthError('Unauthorized', 401)
  return user
}

/** Throws unless the current realm user has one of the allowed roles. */
export async function requireRole(realm: AuthRealm, ...allowed: Role[]) {
  const user = await requireUser(realm)
  if (!allowed.includes(user.role as Role)) {
    throw new AuthError('Forbidden', 403)
  }
  return user
}

/** Re-signs the session cookie with a fresh 7-day expiry (sliding window). */
export async function refreshSession(realm: AuthRealm): Promise<void> {
  const jar = await cookies()
  const token = jar.get(REALM_COOKIE[realm])?.value
  if (!token) return
  const payload = await verifySession(token)
  if (!payload) return
  const fresh = await signSession({
    sub: payload.sub,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  })
  jar.set(REALM_COOKIE[realm], fresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
