import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

// DELETE → unblock an auto-blocked IP (clears the FailedLogin record and lifts
// the 'blocked' flag on any corresponding SuspiciousIp entry).
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('superadmin')
  if (error) return error

  const { id } = await params
  const row = await prisma.failedLogin.findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Lift the block on any SuspiciousIp entry for the same address.
  await prisma.suspiciousIp.updateMany({
    where: { ip: row.ip },
    data: { status: 'suspicious', threat: 'medium' },
  })

  await prisma.failedLogin.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
