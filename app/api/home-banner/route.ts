import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { roleHasPermission } from '@/lib/auth/permissions'

export async function GET() {
  const banner = await prisma.homeBanner.findFirst()
  return NextResponse.json({ banner })
}

export async function PATCH(req: Request) {
  const auth = await authorize('moderator')
  if (auth.error) return auth.error

  // Runtime permission-matrix check — superadmin can revoke 'home_banner' per role.
  if (!(await roleHasPermission(auth.user.role, 'home_banner'))) {
    return NextResponse.json({ error: 'Your role does not have permission to edit the home banner.' }, { status: 403 })
  }

  let body: Record<string, string>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const allowed = ['badge','headline','accentWord','description','primaryBtn','primaryUrl','secondaryBtn','secondaryUrl','imageUrl']
  const data: Record<string, string> = { updatedBy: auth.user.username }
  for (const key of allowed) {
    if (typeof body[key] === 'string') data[key] = body[key]
  }

  const existing = await prisma.homeBanner.findFirst()
  const banner = existing
    ? await prisma.homeBanner.update({ where: { id: existing.id }, data })
    : await prisma.homeBanner.create({ data: data as Parameters<typeof prisma.homeBanner.create>[0]['data'] })

  return NextResponse.json({ banner })
}
