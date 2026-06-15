import { NextResponse } from 'next/server'
import { authorize } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'

// GET /api/bookmarks              → all bookmarked postIds for current user
// GET /api/bookmarks?postId=xxx   → single { bookmarked: bool }
export async function GET(req: Request) {
  const auth = await authorize('user')
  if (auth.error) return auth.error

  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')

  if (postId) {
    const bm = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: auth.user.id, postId } },
    })
    return NextResponse.json({ bookmarked: !!bm })
  }

  const bms = await prisma.bookmark.findMany({
    where: { userId: auth.user.id },
    select: { postId: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ postIds: bms.map((b) => b.postId) })
}

// POST /api/bookmarks   body: { postId }
export async function POST(req: Request) {
  const auth = await authorize('user')
  if (auth.error) return auth.error

  const { postId } = await req.json().catch(() => ({}))
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  try {
    await prisma.bookmark.upsert({
      where: { userId_postId: { userId: auth.user.id, postId } },
      update: {},
      create: { userId: auth.user.id, postId },
    })
    return NextResponse.json({ bookmarked: true })
  } catch (e) {
    console.error('[bookmarks POST] error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Bookmark failed' }, { status: 500 })
  }
}

// DELETE /api/bookmarks   body: { postId }
export async function DELETE(req: Request) {
  const auth = await authorize('user')
  if (auth.error) return auth.error

  const { postId } = await req.json().catch(() => ({}))
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  await prisma.bookmark.deleteMany({
    where: { userId: auth.user.id, postId },
  })
  return NextResponse.json({ bookmarked: false })
}
