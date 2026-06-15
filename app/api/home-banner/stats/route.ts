import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [blogs, readers, sportGroups] = await Promise.all([
    prisma.post.count({ where: { status: 'published' } }),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.sportsData.groupBy({ by: ['sport'] }),
  ])
  return NextResponse.json({ blogs, readers, sports: sportGroups.length || 3 })
}
