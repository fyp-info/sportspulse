import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { authorize } from '@/lib/auth/api'
import { audit } from '@/lib/audit'
import { getMaintenanceMode, setMaintenanceMode } from '@/lib/site-config'

// GET → current maintenance state (public; used by the toggle + public layout).
export async function GET() {
  const maintenance = await getMaintenanceMode()
  return NextResponse.json({ maintenance })
}

// PATCH → turn maintenance on/off. Superadmin only. Body: { on: boolean }
export async function PATCH(req: Request) {
  const auth = await authorize('superadmin')
  if (auth.error) return auth.error

  let body: { on?: boolean }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const on = !!body.on

  await setMaintenanceMode(on, auth.user.username)

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  await audit({
    actor: auth.user.username,
    action: on ? 'Enabled website maintenance mode' : 'Disabled website maintenance mode',
    target: 'site/maintenance',
    ip,
    category: 'admin',
    status: 'success',
  })

  return NextResponse.json({ maintenance: on })
}
