import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { geolocateIp } from '@/lib/geoip'

// GET → self-registered members (role 'user' only) with their last-known IP
// and geolocation. Staff accounts are excluded. Admin+ only.
export async function GET() {
  const { error } = await authorize('admin')
  if (error) return error

  const users = await prisma.user.findMany({
    where: { role: 'user' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      lastLogin: true,
      createdAt: true,
      loginHistory: {
        where: { status: 'success' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { ip: true, createdAt: true },
      },
    },
  })

  const rows = await Promise.all(
    users.map(async (u) => {
      const last = u.loginHistory[0]
      const ip = last?.ip ?? ''
      // geolocateIp caches per-IP and resolves local/dev IPs to the real
      // public location; never throws.
      const geo = ip ? await geolocateIp(ip) : { ip: '', country: '', city: '', network: '' }
      const lastSeen = u.lastLogin ?? last?.createdAt ?? null
      return {
        id: u.id,
        name: u.name || '—',
        username: u.username,
        email: u.email,
        role: u.role,
        ip: geo.ip || ip || '—',
        lastSeen: lastSeen ? lastSeen.toISOString().slice(0, 10) : 'Never',
        country: geo.country || '—',
        city: geo.city || '—',
        network: geo.network || '—',
      }
    }),
  )

  return NextResponse.json({ users: rows })
}
