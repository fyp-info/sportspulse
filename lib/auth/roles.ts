// Edge-safe role helpers (pure data — usable in proxy.ts, server, and client).

export type Role = 'user' | 'editor' | 'moderator' | 'admin' | 'superadmin'

export const ROLE_RANK: Record<Role, number> = {
  user: 0,
  editor: 1,
  moderator: 2,
  admin: 3,
  superadmin: 4,
}

// Where each role lands after logging in.
export const ROLE_HOME: Record<Role, string> = {
  user: '/profile',
  editor: '/dashboard/editor/profile',
  moderator: '/dashboard/moderator/profile',
  admin: '/dashboard/admin/profile',
  superadmin: '/dashboard/superadmin/profile',
}

// Minimum role required to access a dashboard segment. Higher roles inherit access.
const DASHBOARD_MIN_ROLE: { prefix: string; min: Role }[] = [
  { prefix: '/dashboard/superadmin', min: 'superadmin' },
  { prefix: '/dashboard/admin', min: 'admin' },
  { prefix: '/dashboard/moderator', min: 'moderator' },
  { prefix: '/dashboard/editor', min: 'editor' },
]

export function isStaff(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.editor
}

/** Can a user with `role` access the given dashboard `path`? */
export function canAccessDashboard(path: string, role: Role): boolean {
  const rule = DASHBOARD_MIN_ROLE.find(
    (r) => path === r.prefix || path.startsWith(r.prefix + '/'),
  )
  // Generic /dashboard (index) or unknown segment → any staff member.
  if (!rule) return isStaff(role)
  return ROLE_RANK[role] >= ROLE_RANK[rule.min]
}

export function roleHome(role: Role): string {
  return ROLE_HOME[role] ?? '/profile'
}

// A non-superadmin may only manage roles strictly below their own.
// A superadmin may manage any role.
export function canManageRole(actor: Role, target: Role): boolean {
  if (actor === 'superadmin') return true
  return ROLE_RANK[actor] > ROLE_RANK[target]
}
