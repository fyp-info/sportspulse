import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authorize } from '@/lib/auth/api'
import { DEFAULT_PERMISSIONS, type PermissionRow } from '@/lib/permissions'

const ROLE_KEYS = ['user', 'editor', 'moderator', 'admin', 'superadmin'] as const
type RoleKey = (typeof ROLE_KEYS)[number]

// Ensure the table is populated, returning the full ordered matrix.
async function loadMatrix(): Promise<PermissionRow[]> {
  const existing = await prisma.rolePermission.findMany({ orderBy: { order: 'asc' } })
  if (existing.length > 0) {
    return existing.map((r) => ({
      permission: r.permission, label: r.label, order: r.order,
      user: r.user, editor: r.editor, moderator: r.moderator, admin: r.admin, superadmin: r.superadmin,
    }))
  }
  // First run — seed defaults.
  await prisma.$transaction(DEFAULT_PERMISSIONS.map((p) => prisma.rolePermission.create({ data: p })))
  return DEFAULT_PERMISSIONS
}

// GET → the permission matrix. Any staff member may read it.
// Admin (and below) only get the rows their own role has been granted, so they
// see exactly what the superadmin provided to them — nothing more.
export async function GET() {
  const { user, error } = await authorize('editor')
  if (error) return error

  let rows = await loadMatrix()
  const role = user.role as RoleKey
  if (role !== 'superadmin') {
    rows = rows.filter((r) => r[role] === true)
  }
  return NextResponse.json({ permissions: rows, viewerRole: role })
}

// PATCH → save the matrix. Superadmin only. Body: { permissions: PermissionRow[] }
export async function PATCH(req: Request) {
  const { error } = await authorize('superadmin')
  if (error) return error

  let body: { permissions?: PermissionRow[] }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const rows = body.permissions
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: 'permissions array required' }, { status: 400 })
  }

  // superadmin column is always true — never let it be revoked.
  await prisma.$transaction(
    rows.map((r) =>
      prisma.rolePermission.upsert({
        where: { permission: r.permission },
        update: {
          label: r.label, order: r.order,
          user: !!r.user, editor: !!r.editor, moderator: !!r.moderator, admin: !!r.admin, superadmin: true,
        },
        create: {
          permission: r.permission, label: r.label, order: r.order,
          user: !!r.user, editor: !!r.editor, moderator: !!r.moderator, admin: !!r.admin, superadmin: true,
        },
      }),
    ),
  )

  return NextResponse.json({ ok: true })
}
