import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { sendContactReplyEmail } from '@/lib/email'

const schema = z.object({
  replyText: z.string().min(1, 'Reply cannot be empty'),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await authorize('moderator')
  if (error) return error

  const { id } = await params
  const msg = await prisma.contactMessage.findUnique({ where: { id } })
  if (!msg) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { replyText } = parsed.data

  await sendContactReplyEmail(msg.email, {
    name: msg.name,
    subject: msg.subject,
    originalMessage: msg.message,
    replyText,
  })

  await prisma.contactMessage.update({
    where: { id },
    data: { replied: true, read: true, replyText, repliedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}
