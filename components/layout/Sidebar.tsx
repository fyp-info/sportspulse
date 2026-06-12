'use client'

import type { ElementType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, User, FileText, MessageSquare, Users, Shield,
  Settings, BarChart2, Flag, ClipboardList, Crown, Activity,
  Key, LogOut, ChevronRight
} from 'lucide-react'
import { useAuthStore, hasPermission } from '@/lib/store/auth-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  href: string
  label: string
  icon: ElementType
  permission?: string
}

const baseItems: NavItem[] = [
  { href: '/dashboard/user', label: 'Overview', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: User },
]

const editorItems: NavItem[] = [
  { href: '/dashboard/editor', label: 'My Posts', icon: FileText, permission: 'writePost' },
]

const moderatorItems: NavItem[] = [
  { href: '/dashboard/moderator', label: 'Moderation', icon: Flag, permission: 'moderateComments' },
]

const adminItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'User Management', icon: Users, permission: 'manageUsers' },
  { href: '/dashboard/admin#security', label: 'Security', icon: Shield, permission: 'manageUsers' },
  { href: '/dashboard/admin#audit', label: 'Audit Logs', icon: ClipboardList, permission: 'viewAuditLogs' },
]

const superadminItems: NavItem[] = [
  { href: '/dashboard/superadmin', label: 'System Settings', icon: Settings, permission: 'systemSettings' },
  { href: '/dashboard/superadmin#roles', label: 'Role Management', icon: Crown, permission: 'systemSettings' },
  { href: '/dashboard/superadmin#health', label: 'System Health', icon: Activity, permission: 'systemSettings' },
]

const roleDashboardMap: Record<string, string> = {
  user: '/dashboard/user',
  editor: '/dashboard/editor',
  moderator: '/dashboard/moderator',
  admin: '/dashboard/admin',
  superadmin: '/dashboard/superadmin',
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const role = user?.role

  const allItems = [
    ...baseItems,
    ...editorItems.filter((i) => !i.permission || hasPermission(role, i.permission)),
    ...moderatorItems.filter((i) => !i.permission || hasPermission(role, i.permission)),
    ...adminItems.filter((i) => !i.permission || hasPermission(role, i.permission)),
    ...superadminItems.filter((i) => !i.permission || hasPermission(role, i.permission)),
  ]

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white min-h-screen">
      <div className="flex flex-col h-full p-4">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm shrink-0">
            {user?.username?.slice(0, 2).toUpperCase() ?? 'SP'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user?.username}</div>
            <Badge variant="default" className="text-[10px] capitalize mt-0.5">{role}</Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {allItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600')} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-orange-400" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
