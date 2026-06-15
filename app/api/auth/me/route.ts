import { NextResponse } from 'next/server'
import { getCurrentUser, refreshSession } from '@/lib/auth/server'
import { publicUser } from '@/lib/http'
import type { AuthRealm } from '@/lib/auth/jwt'

// Returns the user for the requested realm (?realm=user|staff, default user).
// Also slides the session expiry forward so active users are never logged out.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const realm: AuthRealm = searchParams.get('realm') === 'staff' ? 'staff' : 'user'
  const user = await getCurrentUser(realm)
  if (user) await refreshSession(realm)
  return NextResponse.json({ user: user ? publicUser(user) : null })
}
