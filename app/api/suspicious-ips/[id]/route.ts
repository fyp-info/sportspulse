import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const patchSchema = z.object({ status: z.enum(['blocked', 'suspicious', 'clean']) })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('superadmin')
  if (error) return error
  const { id } = await params

  const parsed = patchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const row = await prisma.suspiciousIp.findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.suspiciousIp.update({ where: { id }, data: { status: parsed.data.status } })

  // When admin unblocks via this page, also lift the auto-block in FailedLogin.
  if (parsed.data.status !== 'blocked') {
    await prisma.failedLogin.updateMany({
      where: { ip: row.ip },
      data: { blocked: false, attempts: 0 },
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('superadmin')
  if (error) return error
  const { id } = await params

  const row = await prisma.suspiciousIp.findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Removing a suspicious IP entry also clears the login block for that IP.
  await prisma.failedLogin.deleteMany({ where: { ip: row.ip } })
  await prisma.suspiciousIp.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
