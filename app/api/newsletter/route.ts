import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({ email: z.email('Enter a valid email') })

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid email' }, { status: 400 })
  }
  const email = parsed.data.email.toLowerCase()

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  })

  return NextResponse.json({ ok: true })
}
