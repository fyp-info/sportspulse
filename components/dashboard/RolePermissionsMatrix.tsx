import { Check, X } from 'lucide-react'

const permissions = [
  { label: 'View public pages', user: true, editor: true, moderator: true, admin: true, superadmin: true },
  { label: 'Comment on articles', user: true, editor: true, moderator: true, admin: true, superadmin: true },
  { label: 'Write posts', user: false, editor: true, moderator: true, admin: true, superadmin: true },
  { label: 'Edit own posts', user: false, editor: true, moderator: true, admin: true, superadmin: true },
  { label: 'Edit/delete any post', user: false, editor: false, moderator: true, admin: true, superadmin: true },
  { label: 'Moderate comments', user: false, editor: false, moderator: true, admin: true, superadmin: true },
  { label: 'Ban users', user: false, editor: false, moderator: true, admin: true, superadmin: true },
  { label: 'Manage users', user: false, editor: false, moderator: false, admin: true, superadmin: true },
  { label: 'Assign roles', user: false, editor: false, moderator: false, admin: true, superadmin: true },
  { label: 'View audit logs', user: false, editor: false, moderator: false, admin: true, superadmin: true },
  { label: 'System settings', user: false, editor: false, moderator: false, admin: false, superadmin: true },
]

const roles = ['user', 'editor', 'moderator', 'admin', 'superadmin']

export default function RolePermissionsMatrix() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Permission</th>
            {roles.map((r) => (
              <th key={r} className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm) => (
            <tr key={perm.label} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700">{perm.label}</td>
              {roles.map((r) => {
                const has = perm[r as keyof typeof perm] as boolean
                return (
                  <td key={r} className="px-4 py-3 text-center">
                    {has ? (
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-gray-200 mx-auto" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
