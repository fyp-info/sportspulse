import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const schema = z.object({
  ip: z.string().min(3, 'IP address is required').max(64),
  reason: z.string().min(1, 'Reason is required').max(200),
  addedBy: z.string().min(1).max(60).optional(),
})

// POST → add an IP to the block list (superadmin).
export async function POST(request: Request) {
  const { user, error } = await authorize('superadmin')
  if (error) return error

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const { ip, reason } = parsed.data
  const addedBy = parsed.data.addedBy || user.username

  const existing = await prisma.blockedIp.findUnique({ where: { ip }, select: { id: true } })
  if (existing) return NextResponse.json({ error: 'That IP is already blocked.' }, { status: 409 })

  const row = await prisma.blockedIp.create({ data: { ip, reason, addedBy } })
  return NextResponse.json({
    blockedIp: { id: row.id, ip: row.ip, reason: row.reason, addedBy: row.addedBy, date: row.createdAt.toISOString().slice(0, 10) },
  }, { status: 201 })
}
