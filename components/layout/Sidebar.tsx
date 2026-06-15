'use client'

import type { ElementType } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  User, LogOut, ChevronRight, ChevronDown,
  Shield, ClipboardList, Crown, AlertTriangle, MessageSquare, Inbox, PenSquare, Trophy, FileText, LayoutDashboard, Users
} from 'lucide-react'
import { useStaffAuth } from '@/lib/store/auth-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  href: string
  label: string
  icon?: ElementType
  exact?: boolean
  emoji?: string
  children?: NavItem[]
}

const sportsChildren = (base: string): NavItem[] => [
  { href: `${base}/sports/football`, label: 'Football', emoji: '⚽' },
  { href: `${base}/sports/cricket`, label: 'Cricket', emoji: '🏏' },
  { href: `${base}/sports/formula-1`, label: 'Formula-1', emoji: '🏎️' },
]

const roleNavItems: Record<string, NavItem[]> = {
  editor: [
    { href: '/dashboard/editor/profile', label: 'Profile',  icon: User },
    { href: '/dashboard/editor/blog',    label: 'Blog',     icon: PenSquare },
    { href: '/dashboard/editor/comments', label: 'Comments', icon: MessageSquare },
  ],
  moderator: [
    { href: '/dashboard/moderator/profile',      label: 'Profile',       icon: User },
    { href: '/dashboard/moderator/home-banner',  label: 'Home Banner',   icon: LayoutDashboard },
    { href: '/dashboard/moderator/blog',         label: 'Blog',          icon: PenSquare },
    { href: '/dashboard/moderator/sports',       label: 'Sports',        icon: Trophy, children: sportsChildren('/dashboard/moderator') },
    { href: '/dashboard/moderator/comments',     label: 'Comments',      icon: MessageSquare },
    { href: '/dashboard/moderator/contact',      label: 'Contact Inbox', icon: Inbox },
  ],
  admin: [
    { href: '/dashboard/admin/profile',         label: 'Profile',         icon: User },
    { href: '/dashboard/admin/home-banner',     label: 'Home Banner',     icon: LayoutDashboard },
    { href: '/dashboard/admin/blog',            label: 'Blog',            icon: PenSquare },
    { href: '/dashboard/admin/sports',          label: 'Sports',          icon: Trophy, children: sportsChildren('/dashboard/admin') },
    { href: '/dashboard/admin/role-management', label: 'Role Management', icon: Crown },
    { href: '/dashboard/admin/registered-users', label: 'Registered Users', icon: Users },
    { href: '/dashboard/admin/comments',        label: 'Comments',        icon: MessageSquare },
    { href: '/dashboard/admin/contact',         label: 'Contact Inbox',   icon: Inbox },
    { href: '/dashboard/admin/legal',           label: 'Legal Pages',     icon: FileText, children: [
      { href: '/dashboard/admin/legal/privacy', label: 'Privacy Policy',    emoji: '🔒' },
      { href: '/dashboard/admin/legal/terms',   label: 'Terms of Service',  emoji: '📋' },
    ]},
  ],
  superadmin: [
    { href: '/dashboard/superadmin/profile',            label: 'Profile',         icon: User },
    { href: '/dashboard/superadmin/home-banner',        label: 'Home Banner',     icon: LayoutDashboard },
    { href: '/dashboard/superadmin/blog',               label: 'Blog',            icon: PenSquare },
    { href: '/dashboard/superadmin/sports',             label: 'Sports',          icon: Trophy, children: sportsChildren('/dashboard/superadmin') },
    { href: '/dashboard/superadmin/role-management',     label: 'Role Management', icon: Crown },
    { href: '/dashboard/superadmin/registered-users',   label: 'Registered Users', icon: Users },
    { href: '/dashboard/superadmin/security',           label: 'Security',        icon: Shield },
    { href: '/dashboard/superadmin/audit-logs',         label: 'Audit Logs',      icon: ClipboardList },
    { href: '/dashboard/superadmin/suspicious-ips',     label: 'Suspicious IPs',  icon: AlertTriangle },
    { href: '/dashboard/superadmin/comments',           label: 'Comments',        icon: MessageSquare },
    { href: '/dashboard/superadmin/contact',            label: 'Contact Inbox',   icon: Inbox },
    { href: '/dashboard/superadmin/legal',              label: 'Legal Pages',     icon: FileText, children: [
      { href: '/dashboard/superadmin/legal/privacy', label: 'Privacy Policy',   emoji: '🔒' },
      { href: '/dashboard/superadmin/legal/terms',   label: 'Terms of Service', emoji: '📋' },
    ]},
  ],
}

function leafClasses(active: boolean) {
  return cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group',
    active ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  )
}

function NavLeaf({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')
  return (
    <Link href={item.href} className={leafClasses(active)}>
      {Icon && <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600')} />}
      <span>{item.label}</span>
      {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-orange-400" />}
    </Link>
  )
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon
  const within = pathname.startsWith(item.href)
  const [open, setOpen] = useState(within)
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className={cn(leafClasses(within && !open), 'w-full')}>
        {Icon && <Icon className={cn('h-4 w-4 shrink-0', within ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600')} />}
        <span>{item.label}</span>
        <ChevronDown className={cn('ml-auto h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-gray-100 flex flex-col gap-0.5">
          {item.children!.map((child) => {
            const active = pathname === child.href || pathname.startsWith(child.href + '/')
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <span className="text-base leading-none">{child.emoji}</span>
                <span>{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useStaffAuth()
  const role = user?.role
  const navItems = (role && roleNavItems[role]) ?? []

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
      <div className="flex flex-col h-full p-4">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              user?.username?.slice(0, 2).toUpperCase() ?? 'SP'
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user?.username}</div>
            <Badge variant="default" className="text-[10px] capitalize mt-0.5">{role}</Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto min-h-0">
          {navItems.map((item, idx) =>
            item.children
              ? <NavGroup key={`${item.href}-${idx}`} item={item} pathname={pathname} />
              : <NavLeaf key={`${item.href}-${idx}`} item={item} pathname={pathname} />
          )}
        </nav>

        {/* Bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
          <button
            onClick={async () => {
              await logout()
              router.push(
                role === 'superadmin'
                  ? '/pulsekk97G18-7-0-9P2-adminn/PulSe-K-Superr/login'
                  : '/pulsekk97G18-7-0-9P2-adminn/login'
              )
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
