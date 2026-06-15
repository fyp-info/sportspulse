import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('superadmin')
  if (error) return error

  const { id } = await params
  const row = await prisma.auditLog.findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.auditLog.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
