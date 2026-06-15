import { NextResponse } from 'next/server'
import { getCurrentUser, destroySession, revokeCurrentSession } from '@/lib/auth/server'
import { getClientInfo } from '@/lib/http'
import { geolocateIp } from '@/lib/geoip'
import { audit } from '@/lib/audit'
import type { AuthRealm } from '@/lib/auth/jwt'

// Clears the session for the given realm only (default 'user'), so logging out
// of the public site does not end a separate dashboard session, and vice versa.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const realm: AuthRealm = body?.realm === 'staff' ? 'staff' : 'user'

  // Capture user identity BEFORE destroying the session.
  const user = await getCurrentUser(realm)
  // Add this token to the server-side denylist so it can't be reused even if
  // it was copied, then clear the cookie.
  await revokeCurrentSession(realm)
  await destroySession(realm)

  if (user) {
    const { ip: rawIp } = getClientInfo(request)
    const geo = await geolocateIp(rawIp)
    const ip = geo.ip || rawIp
    await audit({
      actor: user.username,
      action: `Logout (${realm} session)`,
      target: `auth/logout — role:${user.role}`,
      ip,
      category: 'logout',
      status: 'success',
    })
  }

  return NextResponse.json({ ok: true })
}
