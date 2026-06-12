'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Bell, ChevronDown, Menu, X, Zap, User, LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const sportsLinks = [
  { href: '/sports/football', label: 'Football' },
  { href: '/sports/cricket', label: 'Cricket' },
  { href: '/sports/formula-1', label: 'Formula-1' },
  { href: '/sports/basketball', label: 'Basketball' },
]

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
]

const roleDashboardMap: Record<string, string> = {
  user: '/dashboard/user',
  editor: '/dashboard/editor',
  moderator: '/dashboard/moderator',
  admin: '/dashboard/admin',
  superadmin: '/dashboard/superadmin',
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'SP'
  const dashboardHref = user ? roleDashboardMap[user.role] : '/dashboard/user'

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
            {isAuthenticated && user ? (
              <>
                <button className="relative p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
                      <Avatar className="h-8 w-8">
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
                      <Link href={dashboardHref} className="cursor-pointer"><LayoutDashboard className="h-4 w-4" />My Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer"><Settings className="h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600 cursor-pointer"
                      onClick={logout}
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
            {!isAuthenticated && (
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
