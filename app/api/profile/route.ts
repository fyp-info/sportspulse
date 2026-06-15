import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { createSession, destroySession } from '@/lib/auth/server'
import { publicUser } from '@/lib/http'
import { audit } from '@/lib/audit'
import { sanitizeLine, sanitizeText } from '@/lib/sanitize'

const schema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only').optional(),
  name: z.string().max(80).optional(),
  email: z.email().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
})

export async function PATCH(request: Request) {
  const { user, realm, error } = await authorize('user')
  if (error) return error

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = parsed.data

  // Enforce uniqueness when username/email change.
  if (data.username && data.username !== user.username) {
    const taken = await prisma.user.findFirst({ where: { username: data.username, NOT: { id: user.id } }, select: { id: true } })
    if (taken) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
  let emailChanged = false
  if (data.email) {
    const email = data.email.toLowerCase()
    if (email !== user.email) {
      const taken = await prisma.user.findFirst({ where: { email, NOT: { id: user.id } }, select: { id: true } })
      if (taken) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      data.email = email
      emailChanged = true
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(data.username ? { username: data.username } : {}),
      ...(data.name !== undefined ? { name: sanitizeLine(data.name) } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.bio !== undefined ? { bio: sanitizeText(data.bio) } : {}),
      ...(data.avatar !== undefined ? { avatar: data.avatar } : {}),
      // Changing email requires re-verification.
      ...(emailChanged ? { emailVerified: false } : {}),
    },
  })

  // Refresh the same realm's session cookie so JWT claims stay current.
  await createSession(updated, realm)

  return NextResponse.json({ user: publicUser(updated) })
}

// DELETE → permanently delete the current account (self-service).
export async function DELETE() {
  const { user, realm, error } = await authorize('user')
  if (error) return error

  // Safety: never allow the superadmin account to be self-deleted here, or the
  // whole platform would lose its owner.
  if (user.role === 'superadmin') {
    return NextResponse.json({ error: 'The superadmin account cannot be deleted.' }, { status: 403 })
  }

  // Cascades remove the user's posts, comments, bookmarks, sessions, etc.
  await prisma.user.delete({ where: { id: user.id } })
  await destroySession(realm)

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  await audit({
    actor: user.username,
    action: 'Account deleted by owner',
    target: `user/${user.id}`,
    ip,
    category: 'account',
    status: 'success',
  })

  return NextResponse.json({ ok: true })
}
