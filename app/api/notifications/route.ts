import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import type { Prisma, NotifCategory } from '@prisma/client'

const ALL_CATEGORIES: NotifCategory[] = ['sports', 'blog', 'legal', 'system']

// The categories this user still wants, based on their saved preferences.
async function enabledCategories(userId: string): Promise<NotifCategory[]> {
  const pref = await prisma.notificationPref.findUnique({ where: { userId } })
  if (!pref) return ALL_CATEGORIES // default: everything on
  return ALL_CATEGORIES.filter((c) => pref[c])
}

// Notifications visible to this user: their own personal ones (always) plus
// global broadcasts — but only those sent AFTER they joined, so a brand-new
// member isn't flooded with the entire backlog of past announcements.
function visibilityWhere(userId: string, joinedAt: Date, categories: NotifCategory[]): Prisma.NotificationWhereInput {
  return {
    AND: [
      { category: { in: categories } },
      {
        OR: [
          { userId },                                   // personal — always
          { userId: null, createdAt: { gte: joinedAt } }, // global — only since they joined
        ],
      },
    ],
  }
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

function serialize(n: {
  id: string; category: string; title: string; body: string; href: string; read: boolean; createdAt: Date
}) {
  return {
    id: n.id,
    category: n.category,
    title: n.title,
    body: n.body,
    href: n.href,
    read: n.read,
    time: timeAgo(n.createdAt),
  }
}

// GET → current user's notifications + global broadcasts, filtered to the
// categories they haven't switched off in Settings → Notifications.
export async function GET() {
  const { user, error } = await authorize('user')
  if (error) return error

  const categories = await enabledCategories(user.id)
  if (categories.length === 0) return NextResponse.json({ notifications: [] })

  const me = await prisma.user.findUnique({ where: { id: user.id }, select: { createdAt: true } })
  const joinedAt = me?.createdAt ?? new Date(0)

  const notifications = await prisma.notification.findMany({
    where: visibilityWhere(user.id, joinedAt, categories),
    orderBy: { createdAt: 'desc' },
    take: 30,
  })
  return NextResponse.json({ notifications: notifications.map(serialize) })
}

// PATCH → mark all (visible, still-enabled) notifications read.
export async function PATCH() {
  const { user, error } = await authorize('user')
  if (error) return error

  const categories = await enabledCategories(user.id)
  const me = await prisma.user.findUnique({ where: { id: user.id }, select: { createdAt: true } })
  const joinedAt = me?.createdAt ?? new Date(0)

  await prisma.notification.updateMany({
    where: { ...visibilityWhere(user.id, joinedAt, categories), read: false },
    data: { read: true },
  })
  return NextResponse.json({ ok: true })
}
