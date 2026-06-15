import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { roleHasPermission } from '@/lib/auth/permissions'
import { audit } from '@/lib/audit'
import {
  isSportKey, isValidTab, SPORT_LEAGUE_KEYS, SPORT_TABS, mockSlice, type SportKey,
} from '@/lib/sports-data'

const key = (league: string, tab: string) => `${league}::${tab}`

/**
 * GET /api/sports/[sport]
 * Public. Returns the full matrix of slices for the sport, keyed `${league}::${tab}`,
 * with any saved DB rows overriding the mock defaults so the site is never blank.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params
  if (!isSportKey(sport)) return NextResponse.json({ error: 'Unknown sport' }, { status: 404 })

  const rows = await prisma.sportsData.findMany({ where: { sport } })
  const saved = new Map(rows.map((r) => [key(r.league, r.tab), r.data]))

  const data: Record<string, unknown> = {}
  for (const league of SPORT_LEAGUE_KEYS[sport]) {
    for (const tab of SPORT_TABS[sport]) {
      const k = key(league, tab)
      data[k] = saved.has(k) ? saved.get(k) : mockSlice(sport, league, tab)
    }
  }
  return NextResponse.json({ data })
}

/**
 * PATCH /api/sports/[sport]   body: { league, tab, data }
 * Staff only (moderator+). Upserts exactly one (sport, league, tab) slice — the
 * unique constraint guarantees no other league/tab/sport is touched.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ sport: string }> }) {
  // Authorize first — resolving params before cookies() can drop the request
  // context in Next.js 16, causing cookies() to return an empty jar (→ 401).
  const auth = await authorize('moderator')
  if (auth.error) return auth.error

  // Runtime permission-matrix check — superadmin can revoke 'sports' per role.
  if (!(await roleHasPermission(auth.user.role, 'sports'))) {
    return NextResponse.json({ error: 'Your role does not have permission to manage sports data.' }, { status: 403 })
  }

  const { sport: sportParam } = await params
  if (!isSportKey(sportParam)) return NextResponse.json({ error: 'Unknown sport' }, { status: 404 })
  const sport: SportKey = sportParam

  let body: { league?: string; tab?: string; data?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { league, tab, data } = body
  if (!league || !SPORT_LEAGUE_KEYS[sport].includes(league)) {
    return NextResponse.json({ error: 'Invalid league' }, { status: 400 })
  }
  if (!tab || !isValidTab(sport, tab)) {
    return NextResponse.json({ error: 'Invalid tab' }, { status: 400 })
  }
  if (data === undefined || data === null) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  await prisma.sportsData.upsert({
    where: { sport_league_tab: { sport, league, tab } },
    update: { data: data as object },
    create: { sport, league, tab, data: data as object },
  })

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  await audit({
    actor: auth.user.username,
    action: `Updated ${sport} · ${league} · ${tab}`,
    target: `sports/${sport}`,
    ip,
    category: 'admin',
    status: 'success',
  })

  return NextResponse.json({ ok: true })
}
