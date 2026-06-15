import 'server-only'
import { prisma } from '@/lib/prisma'
import { DEFAULT_PERMISSIONS } from '@/lib/permissions'

// Runtime evaluation of the configurable role-permission matrix. The matrix
// lives in the RolePermission table (edited by the superadmin); this reads it
// with a short in-memory cache so it can be consulted on every request cheaply.

type Matrix = Record<string, Record<string, boolean>>

let cache: { at: number; matrix: Matrix } | null = null
const TTL = 15_000 // 15s — changes take effect within seconds, no per-request DB hit

function toMatrix(rows: { permission: string; user: boolean; editor: boolean; moderator: boolean; admin: boolean; superadmin: boolean }[]): Matrix {
  const m: Matrix = {}
  for (const r of rows) {
    m[r.permission] = { user: r.user, editor: r.editor, moderator: r.moderator, admin: r.admin, superadmin: r.superadmin }
  }
  return m
}

async function loadMatrix(): Promise<Matrix> {
  if (cache && Date.now() - cache.at < TTL) return cache.matrix
  let matrix: Matrix
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (prisma as any).rolePermission
    const rows = model ? await model.findMany() : []
    matrix = toMatrix(rows.length ? rows : DEFAULT_PERMISSIONS)
  } catch {
    matrix = toMatrix(DEFAULT_PERMISSIONS) // fail to the documented defaults
  }
  cache = { at: Date.now(), matrix }
  return matrix
}

/**
 * True if `role` currently holds `permission` per the live matrix. Superadmin
 * always passes (it can never have a permission revoked).
 */
export async function roleHasPermission(role: string, permission: string): Promise<boolean> {
  if (role === 'superadmin') return true
  const matrix = await loadMatrix()
  return !!matrix[permission]?.[role]
}
