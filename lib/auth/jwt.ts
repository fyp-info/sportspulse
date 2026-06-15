// Edge-safe JWT helpers (used by both proxy.ts and server code).
// Uses `jose` because it runs in the Edge runtime, unlike `jsonwebtoken`.
import { SignJWT, jwtVerify } from 'jose'

export interface SessionPayload {
  sub: string // user id
  username: string
  email: string
  role: string
  jti?: string // unique token id, used for server-side revocation on logout
  exp?: number // expiry (epoch seconds), set by jose
  [key: string]: unknown
}

// Two independent realms so a public member session and a staff/dashboard
// session never share a cookie (logging into one cannot affect the other).
export type AuthRealm = 'user' | 'staff'
export const REALM_COOKIE: Record<AuthRealm, string> = {
  user: 'sp_user',
  staff: 'sp_staff',
}
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days (seconds)

const ALG = 'HS256'

function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    // Don't crash the edge bundle, but make the misconfiguration loud.
    console.warn('[auth] NEXTAUTH_SECRET is not set — using an insecure dev fallback.')
  }
  return new TextEncoder().encode(secret || 'insecure-dev-secret-change-me')
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setJti(crypto.randomUUID()) // unique id so the token can be revoked on logout
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
