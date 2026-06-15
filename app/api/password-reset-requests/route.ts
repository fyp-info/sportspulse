import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import type { Role } from '@/lib/auth/roles'

function serialize(r: {
  id: string; email: string; fullName: string; message: string
  role: string | null; status: string; createdAt: Date
}) {
  return {
    id: r.id,
    email: r.email,
    fullName: r.fullName,
    message: r.message,
    role: r.role,
    status: r.status,
    date: r.createdAt.toISOString().slice(0, 16).replace('T', ' '),
  }
}

// POST → a staff member requests a password reset from the staff portal (public).
const createSchema = z.object({
  email: z.email('Enter a valid email'),
  fullName: z.string().min(1, 'Full name is required').max(120),
  message: z.string().max(1000).optional().default(''),
})

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const email = parsed.data.email.toLowerCase()

  // Attach the requester's role if the email matches a staff account.
  const account = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } })
  const isStaff = account && account.role !== 'user'

  await prisma.passwordResetRequest.create({
    data: {
      email,
      fullName: parsed.data.fullName,
      message: parsed.data.message,
      userId: isStaff ? account!.id : null,
      role: isStaff ? account!.role : null,
    },
  })

  // Always succeed so we don't reveal which emails exist.
  return NextResponse.json({ ok: true }, { status: 201 })
}

// GET → reset requests the actor is allowed to handle.
export async function GET() {
  const { user: actor, error } = await authorize('admin')
  if (error) return error

  // Admins handle editor/moderator requests; superadmin handles everything.
  const where =
    actor.role === 'superadmin' ? {} : { role: { in: ['editor', 'moderator'] as Role[] } }

  const requests = await prisma.passwordResetRequest.findMany({
    where,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })
  return NextResponse.json({ requests: requests.map(serialize) })
}
