import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const DEFAULTS = { sports: true, blog: true, legal: true, system: true }

// GET → current user's notification preferences (creates defaults if missing).
export async function GET() {
  const { user, error } = await authorize('user')
  if (error) return error

  const pref = await prisma.notificationPref.findUnique({ where: { userId: user.id } })
  return NextResponse.json({
    prefs: pref
      ? { sports: pref.sports, blog: pref.blog, legal: pref.legal, system: pref.system }
      : DEFAULTS,
  })
}

const schema = z.object({
  sports: z.boolean(),
  blog: z.boolean(),
  legal: z.boolean(),
  system: z.boolean(),
})

// PUT → save preferences.
export async function PUT(request: Request) {
  const { user, error } = await authorize('user')
  if (error) return error

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  await prisma.notificationPref.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  })
  return NextResponse.json({ ok: true })
}
