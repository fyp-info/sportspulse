import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { resolveLegalContent, type LegalType } from '@/lib/legal-defaults'
import type { Prisma } from '@prisma/client'

function validType(t: string): t is LegalType {
  return t === 'privacy' || t === 'terms'
}

// GET → public: the resolved content (saved, or defaults).
export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  if (!validType(type)) return NextResponse.json({ error: 'Unknown document' }, { status: 404 })

  const doc = await prisma.legalDoc.findUnique({ where: { type } })
  return NextResponse.json({
    content: resolveLegalContent(type, doc?.content),
    updatedAt: doc?.updatedAt ?? null,
  })
}

// PUT → admin+: save content.
export async function PUT(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { error } = await authorize('admin')
  if (error) return error

  const { type } = await params
  if (!validType(type)) return NextResponse.json({ error: 'Unknown document' }, { status: 404 })

  const body = await request.json().catch(() => null)
  const content = body?.content
  if (!content || !Array.isArray(content.sections)) {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
  }

  const doc = await prisma.legalDoc.upsert({
    where: { type },
    create: { type, content: content as Prisma.InputJsonValue },
    update: { content: content as Prisma.InputJsonValue },
  })

  // Notify users that the legal page changed.
  await prisma.notification.create({
    data: {
      category: 'legal',
      title: `${type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} Updated`,
      body: 'Our legal pages were updated. Tap to review the changes.',
      href: `/${type}`,
    },
  })

  return NextResponse.json({ ok: true, updatedAt: doc.updatedAt })
}
