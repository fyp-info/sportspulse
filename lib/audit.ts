import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export type AuditCategory = 'login' | 'logout' | 'failed_login' | 'access_denied' | '2fa' | 'admin' | 'account'
export type AuditStatus = 'success' | 'failed' | 'blocked' | 'denied'

export async function audit(opts: {
  actor: string
  action: string
  target: string
  ip: string
  category: AuditCategory
  status: AuditStatus
}): Promise<void> {
  // Structured log line for real-time monitoring (in addition to the DB record).
  // Failed/blocked/denied events log at warn level so they stand out.
  const level = opts.status === 'success' ? 'info' : 'warn'
  logger[level]('audit', opts)

  try {
    await prisma.auditLog.create({ data: opts })
  } catch {
    // Audit failures must never break the main request flow.
  }
}
