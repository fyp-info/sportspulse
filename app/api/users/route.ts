import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { hashPassword } from '@/lib/auth/server'
import { sendStaffWelcomeEmail } from '@/lib/email'
import { canManageRole, type Role } from '@/lib/auth/roles'

// GET → user list (admin+). Optional ?roles=editor,moderator filter.
export async function GET(request: Request) {
  const { error } = await authorize('admin')
  if (error) return error

  const { searchParams } = new URL(request.url)
  const roles = searchParams.get('roles')?.split(',').filter(Boolean) as Role[] | undefined

  const users = await prisma.user.findMany({
    where: roles?.length ? { role: { in: roles } } : undefined,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, username: true, name: true, email: true, role: true,
      isActive: true, bio: true, avatar: true, createdAt: true, lastLogin: true,
    },
  })

  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString().slice(0, 10),
      lastLogin: u.lastLogin ? u.lastLogin.toISOString().slice(0, 10) : '—',
    })),
  })
}

const createSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  name: z.string().max(80).optional().default(''),
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'editor', 'moderator', 'admin', 'superadmin']),
})

// POST → create a staff account (admin+, subject to role hierarchy).
export async function POST(request: Request) {
  const { user: actor, error } = await authorize('admin')
  if (error) return error

  const parsed = createSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const { username, name, password, role } = parsed.data
  const email = parsed.data.email.toLowerCase()

  if (!canManageRole(actor.role as Role, role)) {
    return NextResponse.json({ error: `You cannot create a ${role} account.` }, { status: 403 })
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, role: true },
  })
  if (existing) {
    // The Staff Accounts list only shows staff roles, so a clash with a public
    // member (role 'user') or a role you don't manage looks invisible there.
    // Name the role in the message so it isn't a mystery.
    const where = existing.role === 'user' ? 'a registered website user' : `an existing ${existing.role} account`
    const msg = existing.email === email
      ? `Email already registered to ${where}. Use a different email.`
      : `Username already taken by ${where}. Choose a different username.`
    return NextResponse.json({ error: msg }, { status: 409 })
  }

  const created = await prisma.user.create({
    // Admin-provisioned accounts are trusted, so they start verified.
    data: { username, name, email, role, passwordHash: await hashPassword(password), emailVerified: true },
    select: { id: true, username: true, name: true, email: true, role: true, isActive: true, createdAt: true, lastLogin: true },
  })

  // Email the new staff member their login credentials.
  await sendStaffWelcomeEmail(email, { name, username, role, password })

  return NextResponse.json({
    user: {
      ...created,
      createdAt: created.createdAt.toISOString().slice(0, 10),
      lastLogin: created.lastLogin ? created.lastLogin.toISOString().slice(0, 10) : 'Just now',
    },
  }, { status: 201 })
}
