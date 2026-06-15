import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { sanitizeLine, sanitizeText, sanitizeEmail } from '@/lib/sanitize'

function serialize(m: {
  id: string; name: string; email: string; subject: string; message: string
  read: boolean; replied: boolean; replyText: string | null; createdAt: Date
}) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    read: m.read,
    replied: m.replied,
    replyText: m.replyText ?? undefined,
    date: m.createdAt.toISOString().slice(0, 16).replace('T', ' '),
  }
}

// GET → inbox (moderator+)
export async function GET() {
  const { error } = await authorize('moderator')
  if (error) return error
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ messages: messages.map(serialize) })
}

const createSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.email('Enter a valid email'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
})

// POST → public contact form
export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }
  const data = {
    name: sanitizeLine(parsed.data.name),
    email: sanitizeEmail(parsed.data.email),
    subject: sanitizeLine(parsed.data.subject),
    message: sanitizeText(parsed.data.message),
  }
  if (!data.name || !data.subject || !data.message) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 })
  }
  await prisma.contactMessage.create({ data })
  return NextResponse.json({ ok: true }, { status: 201 })
}
