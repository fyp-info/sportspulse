import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { hashPassword } from '@/lib/auth/server'
import { canManageRole, type Role } from '@/lib/auth/roles'

const patchSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  name: z.string().max(80).optional(),
  email: z.email().optional(),
  role: z.enum(['user', 'editor', 'moderator', 'admin', 'superadmin']).optional(),
  password: z.string().min(6).optional(),
  isActive: z.boolean().optional(), // suspend / reactivate
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: actor, error } = await authorize('admin')
  if (error) return error
  const { id } = await params

  if (id === actor.id) {
    return NextResponse.json({ error: 'Edit your own account from your profile.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (!canManageRole(actor.role as Role, target.role as Role)) {
    return NextResponse.json({ error: 'You cannot manage this account.' }, { status: 403 })
  }

  const parsed = patchSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = parsed.data

  if (data.role && data.role !== target.role && !canManageRole(actor.role as Role, data.role)) {
    return NextResponse.json({ error: `You cannot assign the ${data.role} role.` }, { status: 403 })
  }

  // Uniqueness checks
  if (data.username && data.username !== target.username) {
    const taken = await prisma.user.findFirst({ where: { username: data.username, NOT: { id } }, select: { id: true } })
    if (taken) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
  if (data.email) {
    data.email = data.email.toLowerCase()
    if (data.email !== target.email) {
      const taken = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } }, select: { id: true } })
      if (taken) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
  }

  await prisma.user.update({
    where: { id },
    data: {
      ...(data.username ? { username: data.username } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.role ? { role: data.role } : {}),
      ...(data.password ? { passwordHash: await hashPassword(data.password) } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: actor, error } = await authorize('admin')
  if (error) return error
  const { id } = await params

  if (id === actor.id) {
    return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (!canManageRole(actor.role as Role, target.role as Role)) {
    return NextResponse.json({ error: 'You cannot delete this account.' }, { status: 403 })
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
