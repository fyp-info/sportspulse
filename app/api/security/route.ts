import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'

const fmt = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ')

// GET → security overview (superadmin): sessions, failed logins, blocked IPs.
export async function GET() {
  const { error } = await authorize('superadmin')
  if (error) return error

  const [sessions, failedLogins, blockedIps] = await Promise.all([
    prisma.session.findMany({ orderBy: { lastActive: 'desc' } }),
    prisma.failedLogin.findMany({ orderBy: { lastAttempt: 'desc' } }),
    prisma.blockedIp.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id, device: s.device, ip: s.ip, location: s.location,
      current: s.current, lastActive: fmt(s.lastActive),
    })),
    failedLogins: failedLogins.map((f) => ({
      id: f.id, ip: f.ip, attempts: f.attempts, lastAttempt: fmt(f.lastAttempt),
      country: f.country, blocked: f.blocked,
    })),
    blockedIps: blockedIps.map((b) => ({
      id: b.id, ip: b.ip, reason: b.reason, addedBy: b.addedBy,
      date: b.createdAt.toISOString().slice(0, 10),
    })),
  })
}
