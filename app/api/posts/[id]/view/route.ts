import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/posts/[id]/view  — increments the view counter once per client visit
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.post.updateMany({
    where: { id, status: 'published' },
    data: { views: { increment: 1 } },
  })
  return NextResponse.json({ ok: true })
}
