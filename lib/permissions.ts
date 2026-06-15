// Default role-permission matrix. The DB (RolePermission) is the source of
// truth at runtime; this seeds it on first load and documents each permission.
//
// Booleans = which roles hold the permission by default. The superadmin can
// change any of these from Role Management; changes persist to the database.

export interface PermissionRow {
  permission: string // stable key
  label: string
  order: number
  user: boolean
  editor: boolean
  moderator: boolean
  admin: boolean
  superadmin: boolean
}

// Order chosen so public/content permissions come first, then dashboard-area
// access, then privileged controls.
export const DEFAULT_PERMISSIONS: PermissionRow[] = [
  // ── Public / content ──────────────────────────────────────────────────────
  { permission: 'view_public',      label: 'View public pages',   order: 10, user: true,  editor: true,  moderator: true,  admin: true,  superadmin: true },
  { permission: 'write_posts',      label: 'Write posts',         order: 30, user: false, editor: true,  moderator: true,  admin: true,  superadmin: true },
  { permission: 'edit_own_posts',   label: 'Edit own posts',      order: 40, user: false, editor: true,  moderator: true,  admin: true,  superadmin: true },
  { permission: 'edit_any_post',    label: 'Edit/delete any post',order: 50, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },
  { permission: 'moderate_comments',label: 'Moderate comments',   order: 60, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },

  // ── Dashboard-area access ─────────────────────────────────────────────────
  { permission: 'blog',             label: 'Blog',                order: 70, user: false, editor: true,  moderator: true,  admin: true,  superadmin: true },
  { permission: 'home_banner',      label: 'Home Banner',         order: 80, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },
  { permission: 'sports',           label: 'Sports access',       order: 90, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },
  { permission: 'contact_inbox',    label: 'Contact Inbox',       order: 100, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },
  { permission: 'legal_pages',      label: 'Legal Pages',         order: 110, user: false, editor: false, moderator: false, admin: true,  superadmin: true },

  // ── Privileged controls ───────────────────────────────────────────────────
  { permission: 'ban_users',        label: 'Ban users',           order: 120, user: false, editor: false, moderator: true,  admin: true,  superadmin: true },
  { permission: 'assign_roles',     label: 'Assign roles',        order: 130, user: false, editor: false, moderator: false, admin: true,  superadmin: true },
  { permission: 'audit_logs',       label: 'View audit logs',     order: 140, user: false, editor: false, moderator: false, admin: true,  superadmin: true },
  { permission: 'suspicious_ips',   label: 'Suspicious IPs',      order: 150, user: false, editor: false, moderator: false, admin: false, superadmin: true },
]
