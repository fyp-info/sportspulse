import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { hashPassword } from '@/lib/auth/server'
import { sendPasswordChangedEmail } from '@/lib/email'
import { canManageRole, type Role } from '@/lib/auth/roles'

const schema = z.object({
  action: z.enum(['resolve', 'reject']),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: actor, error } = await authorize('admin')
  if (error) return error
  const { id } = await params

  const req = await prisma.passwordResetRequest.findUnique({ where: { id }, include: { user: true } })
  if (!req) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

  // The actor must be allowed to manage the requester's role.
  if (req.role && !canManageRole(actor.role as Role, req.role as Role) && actor.role !== 'superadmin') {
    return NextResponse.json({ error: 'You cannot handle this request.' }, { status: 403 })
  }
  // Unknown-email requests (no role) are superadmin-only.
  if (!req.role && actor.role !== 'superadmin') {
    return NextResponse.json({ error: 'You cannot handle this request.' }, { status: 403 })
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  if (parsed.data.action === 'reject') {
    await prisma.passwordResetRequest.update({ where: { id }, data: { status: 'rejected' } })
    return NextResponse.json({ ok: true })
  }

  // resolve → set a new password on the linked account and email it.
  if (!req.user) {
    return NextResponse.json({ error: 'No matching account for this request.' }, { status: 400 })
  }
  if (!parsed.data.newPassword) {
    return NextResponse.json({ error: 'Enter a new password.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  })
  await sendPasswordChangedEmail(req.user.email, parsed.data.newPassword)
  await prisma.passwordResetRequest.update({ where: { id }, data: { status: 'resolved' } })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('admin')
  if (error) return error
  const { id } = await params
  await prisma.passwordResetRequest.deleteMany({ where: { id } })
  return NextResponse.json({ ok: true })
}
