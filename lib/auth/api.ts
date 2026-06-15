// Helper for route handlers: returns the current user or a ready-made error
// response. Role checks use the hierarchy in roles.ts (higher roles inherit).
//
// Realm resolution:
//   • Staff-level routes (minRole editor+) always use the STAFF session.
//   • Member-level routes (minRole 'user' / none) use the realm named by the
//     `x-auth-realm` request header, defaulting to the USER session. This lets
//     a shared endpoint (e.g. /api/profile, /api/upload) act on the dashboard
//     identity when called from the dashboard, and the member identity when
//     called from the public site.
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getCurrentUser } from './server'
import { ROLE_RANK, type Role } from './roles'
import { audit } from '@/lib/audit'
import type { AuthRealm } from './jwt'

type AuthOk = { user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; realm: AuthRealm; error: null }
type AuthErr = { user: null; realm: AuthRealm; error: NextResponse }

export async function authorize(minRole?: Role): Promise<AuthOk | AuthErr> {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'

  let realm: AuthRealm = 'user'
  if (minRole && ROLE_RANK[minRole] >= ROLE_RANK.editor) {
    realm = 'staff'
  } else {
    realm = h.get('x-auth-realm') === 'staff' ? 'staff' : 'user'
  }

  const user = await getCurrentUser(realm)

  if (!user) {
    // Only log 401s on staff-level routes — anonymous requests to public
    // endpoints generate too much noise to be useful.
    if (minRole && ROLE_RANK[minRole] >= ROLE_RANK.editor) {
      await audit({
        actor: 'anonymous',
        action: 'Unauthorized access attempt',
        target: `requires:${minRole}`,
        ip,
        category: 'access_denied',
        status: 'denied',
      })
    }
    return { user: null, realm, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (minRole && ROLE_RANK[user.role as Role] < ROLE_RANK[minRole]) {
    await audit({
      actor: user.username,
      action: `Access denied — requires ${minRole} role`,
      target: `requires:${minRole}`,
      ip,
      category: 'access_denied',
      status: 'denied',
    })
    return { user: null, realm, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user, realm, error: null }
}
