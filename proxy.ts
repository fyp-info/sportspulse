// Next.js 16 renamed `middleware` → `proxy`. Runs on the Edge runtime, so it
// only uses jose (no Prisma/bcrypt). It gates /dashboard by auth + role.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession, REALM_COOKIE } from '@/lib/auth/jwt'
import { canAccessDashboard, roleHome, type Role } from '@/lib/auth/roles'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  // The dashboard is gated by the STAFF session only.
  const token = request.cookies.get(REALM_COOKIE.staff)?.value
  const session = token ? await verifySession(token) : null

  // Not signed in → send to login, remembering where they wanted to go.
  if (!session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  const role = session.role as Role

  // Signed in but lacking the role for this dashboard segment → bounce home.
  if (!canAccessDashboard(pathname, role)) {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only guard the dashboard. Public pages and the obfuscated login portals
  // stay open; API routes do their own auth checks.
  matcher: ['/dashboard/:path*'],
}
