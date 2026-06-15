import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth/server'
import { issueEmailVerificationCode } from '@/lib/auth/email-code'
import { getClientInfo } from '@/lib/http'
import { geolocateIp } from '@/lib/geoip'

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { username, password } = parsed.data
  const email = parsed.data.email.toLowerCase()

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true },
  })
  if (existing) {
    return NextResponse.json(
      { error: existing.email === email ? 'Email already registered' : 'Username already taken' },
      { status: 409 },
    )
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { username, email, passwordHash, role: 'user' },
    select: { id: true, email: true },
  })

  // Capture the signup IP + real geolocation so this member shows real
  // country/city/network on the Registered Users page from the moment they
  // join (in dev, local IPs resolve to the server's real public location).
  const { ip: rawIp, device } = getClientInfo(request)
  const geo = await geolocateIp(rawIp)
  const ip = geo.ip || rawIp
  const location = [geo.city, geo.country].filter(Boolean).join(', ')
  await prisma.loginHistory.create({
    data: { userId: user.id, ip, device, location, status: 'success' },
  })

  await issueEmailVerificationCode(user.id, user.email)

  return NextResponse.json({ ok: true })
}
