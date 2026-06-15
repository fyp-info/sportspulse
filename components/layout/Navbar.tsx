'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Bell, ChevronDown, Menu, X, Zap, User, Settings, LogOut,
  Trophy, PenSquare, Scale, ShieldAlert, CheckCheck, ArrowRight, Bookmark,
} from 'lucide-react'
import { useUserAuth } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type Notification, type NotifCategory } from '@/lib/mock-data/notifications'

const sportsLinks = [
  { href: '/sports/football', label: 'Football' },
  { href: '/sports/cricket', label: 'Cricket' },
  { href: '/sports/formula-1', label: 'Formula-1' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
]


// ── Notification helpers ──────────────────────────────────────────────────────

const CATEGORY_META: Record<NotifCategory, { icon: typeof Trophy; color: string; bg: string }> = {
  sports:  { icon: Trophy,      color: 'text-orange-500', bg: 'bg-orange-100' },
  blog:    { icon: PenSquare,   color: 'text-blue-500',   bg: 'bg-blue-100'   },
  legal:   { icon: Scale,       color: 'text-purple-500', bg: 'bg-purple-100' },
  system:  { icon: ShieldAlert, color: 'text-red-500',    bg: 'bg-red-100'    },
}

const CATEGORY_LABEL: Record<NotifCategory, string> = {
  sports: 'Sports',
  blog:   'Blog',
  legal:  'Legal',
  system: 'System',
}

function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: {
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClose: () => void
}) {
  const router = useRouter()
  const unread = notifications.filter(n => !n.read).length

  const handleClick = (n: Notification) => {
    onMarkRead(n.id)
    onClose()
    router.push(n.href)
  }

  return (
    <div className="flex flex-col" style={{ width: 360 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">Notifications</span>
          {unread > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400">No notifications</div>
        ) : (
          notifications.map((n) => {
            const meta = CATEGORY_META[n.category]
            const Icon = meta.icon
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50 last:border-0',
                  n.read ? 'hover:bg-gray-50' : 'bg-orange-50/40 hover:bg-orange-50/70'
                )}
              >
                {/* Icon */}
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', meta.bg)}>
                  <Icon className={cn('h-4 w-4', meta.color)} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-xs font-semibold uppercase tracking-wide', meta.color)}>
                      {CATEGORY_LABEL[n.category]}
                    </span>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    )}
                  </div>
                  <p className={cn('text-sm leading-snug', n.read ? 'text-gray-600' : 'text-gray-900 font-medium')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-1.5" />
              </button>
            )
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-orange-500 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useUserAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // The public site is for members (role 'user'). Staff have their own dashboard,
  // so on the public navbar they are treated as visitors (Login / Register).
  const isPublicUser = isAuthenticated && user?.role === 'user'

  const unreadCount = notifications.filter(n => !n.read).length

  // Load the signed-in member's notifications (global + personal).
  useEffect(() => {
    if (!isPublicUser) {
      setNotifications([])
      return
    }
    let cancelled = false
    fetch('/api/notifications', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : { notifications: [] })
      .then(d => { if (!cancelled) setNotifications(d.notifications ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [isPublicUser])

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    fetch(`/api/notifications/${id}`, { method: 'PATCH' }).catch(() => {})
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    fetch('/api/notifications', { method: 'PATCH' }).catch(() => {})
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'SP'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Sports dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  Sports <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {sportsLinks.map((s) => (
                  <DropdownMenuItem key={s.href} asChild>
                    <Link href={s.href}>{s.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isPublicUser && user ? (
              <>
                <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="p-0 overflow-hidden" sideOffset={8}>
                    <NotificationPanel
                      notifications={notifications}
                      onMarkRead={markRead}
                      onMarkAllRead={markAllRead}
                      onClose={() => setNotifOpen(false)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                      <Avatar className="h-8 w-8">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <div className="font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500 font-normal">{user.email}</div>
                      <Badge variant="default" className="mt-1 text-[10px] capitalize">{user.role}</Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer"><User className="h-4 w-4" />My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookmarks" className="cursor-pointer"><Bookmark className="h-4 w-4" />Bookmarks</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer"><Settings className="h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600 cursor-pointer"
                      onClick={async () => { await logout(); router.push('/login') }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">Sports</div>
            {sportsLinks.map((s) => (
              <Link key={s.href} href={s.href} className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg pl-6" onClick={() => setMobileOpen(false)}>
                {s.label}
              </Link>
            ))}
            {navLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {!isPublicUser && (
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="primary" size="sm" className="flex-1" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
