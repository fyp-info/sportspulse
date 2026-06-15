import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

export async function GET() {
  const { error } = await authorize('admin')
  if (error) return error

  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  return NextResponse.json({
    logs: logs.map((l) => ({
      id: l.id,
      user: l.actor,
      action: l.action,
      target: l.target,
      ip: l.ip,
      category: l.category,
      status: l.status,
      date: l.createdAt.toISOString().slice(0, 19).replace('T', ' '),
    })),
  })
}

// Superadmin-only: wipe all audit logs.
export async function DELETE() {
  const { error } = await authorize('superadmin')
  if (error) return error

  const { count } = await prisma.auditLog.deleteMany()
  return NextResponse.json({ ok: true, deleted: count })
}
