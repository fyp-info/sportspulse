import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

// GET → the current user's recent login history.
export async function GET() {
  const { user, error } = await authorize('user')
  if (error) return error

  const history = await prisma.loginHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 15,
  })

  return NextResponse.json({
    history: history.map((h) => ({
      id: h.id,
      date: h.createdAt.toISOString().slice(0, 16).replace('T', ' '),
      ip: h.ip,
      device: h.device,
      location: h.location || '—',
      status: h.status,
    })),
  })
}
