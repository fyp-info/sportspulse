'use client'

import { create } from 'zustand'
import type { Role } from '@/lib/auth/roles'

export type AuthRealm = 'user' | 'staff'
export type LoginScope = 'user' | 'staff' | 'superadmin'

export interface AuthUser {
  id: string
  username: string
  name: string
  email: string
  role: Role
  avatar: string
  bio: string
  emailVerified: boolean
  twoFactorEnabled: boolean
}

interface LoginResult {
  ok: boolean
  user?: AuthUser
  error?: string
  twoFactor?: boolean
  challengeId?: string
  needsVerification?: boolean
  email?: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  hydrate: () => Promise<void>
  login: (identifier: string, password: string, scope?: LoginScope) => Promise<LoginResult>
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
}

// Each realm gets its own independent store + cookie, so a member session and a
// staff session never interfere with each other.
function makeAuthStore(realm: AuthRealm, defaultScope: LoginScope) {
  return create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    hydrate: async () => {
      try {
        const res = await fetch(`/api/auth/me?realm=${realm}`, { cache: 'no-store' })
        const data = await res.json()
        set({ user: data.user ?? null, isAuthenticated: !!data.user, loading: false })
      } catch {
        set({ user: null, isAuthenticated: false, loading: false })
      }
    },

    login: async (identifier, password, scope) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password, scope: scope ?? defaultScope }),
        })
        const data = await res.json()
        if (!res.ok) return { ok: false, error: data.error ?? 'Login failed' }
        // Unverified email → no session yet; caller must collect the emailed code.
        if (data.needsVerification) return { ok: true, needsVerification: true, email: data.email }
        // 2FA enabled → no session yet; caller must collect the emailed code.
        if (data.twoFactor) return { ok: true, twoFactor: true, challengeId: data.challengeId }
        set({ user: data.user, isAuthenticated: true, loading: false })
        return { ok: true, user: data.user }
      } catch {
        return { ok: false, error: 'Network error. Please try again.' }
      }
    },

    logout: async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ realm }),
        })
      } catch {
        /* ignore */
      }
      set({ user: null, isAuthenticated: false })
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),
  }))
}

// Public site (members) and dashboard (staff) — two separate sessions.
export const useUserAuth = makeAuthStore('user', 'user')
export const useStaffAuth = makeAuthStore('staff', 'staff')

// When a dashboard (staff) component calls a shared member-level endpoint
// (e.g. /api/profile, /api/upload), include this header so the server uses the
// staff session rather than the member one.
export const STAFF_REALM_HEADER = { 'x-auth-realm': 'staff' } as const
