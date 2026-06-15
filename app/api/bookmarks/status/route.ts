import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/server'

// GET /api/bookmarks/status?postId=xxx  (public)
// Returns the total bookmark count for the post, plus whether the current
// member (if signed in) has bookmarked it. Count is visible to everyone.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const count = await prisma.bookmark.count({ where: { postId } })

  let bookmarked = false
  const user = await getCurrentUser('user')
  if (user) {
    const bm = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: user.id, postId } },
    })
    bookmarked = !!bm
  }

  return NextResponse.json({ count, bookmarked, authenticated: !!user })
}
