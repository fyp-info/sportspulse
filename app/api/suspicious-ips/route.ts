import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { geolocateIp } from '@/lib/geoip'

// GET → suspicious IPs (superadmin).
// Also syncs any auto-blocked IPs from FailedLogin that aren't already in this
// table, so blocks triggered before or after the current code change all appear.
export async function GET() {
  const { error } = await authorize('superadmin')
  if (error) return error

  // Find FailedLogin rows that are blocked but have no SuspiciousIp counterpart.
  const autoBlocked = await prisma.failedLogin.findMany({ where: { blocked: true } })
  if (autoBlocked.length > 0) {
    const existing = await prisma.suspiciousIp.findMany({
      where: { ip: { in: autoBlocked.map((b) => b.ip) } },
      select: { ip: true },
    })
    const knownIps = new Set(existing.map((e) => e.ip))
    const missing = autoBlocked.filter((b) => !knownIps.has(b.ip))
    for (const b of missing) {
      const geo = await geolocateIp(b.ip)
      await prisma.suspiciousIp.create({
        data: { ip: b.ip, status: 'blocked', threat: 'high', attempts: b.attempts, country: geo.country, city: geo.city, network: geo.network },
      })
    }
  }

  // Back-fill location for any existing rows that were stored without one.
  const blank = await prisma.suspiciousIp.findMany({ where: { country: '' } })
  for (const row of blank) {
    const geo = await geolocateIp(row.ip)
    if (geo.country || geo.city || geo.network) {
      await prisma.suspiciousIp.update({
        where: { id: row.id },
        data: { country: geo.country, city: geo.city, network: geo.network },
      })
    }
  }

  const ips = await prisma.suspiciousIp.findMany({ orderBy: { lastSeen: 'desc' } })
  return NextResponse.json({
    ips: ips.map((i) => ({
      id: i.id,
      ip: i.ip,
      country: i.country,
      city: i.city,
      network: i.network,
      status: i.status,
      threat: i.threat,
      attempts: i.attempts,
      lastSeen: i.lastSeen.toISOString().slice(0, 16).replace('T', ' '),
    })),
  })
}
