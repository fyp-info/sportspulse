'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Role, mockUsers } from '@/lib/mock-data/users'

interface AuthUser {
  id: string
  username: string
  email: string
  role: Role
  avatar: string
  bio: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
  switchRole: (role: Role) => void
}

const roleUsers: Record<Role, AuthUser> = {
  user: mockUsers[0],
  editor: mockUsers[1],
  moderator: mockUsers[2],
  admin: mockUsers[3],
  superadmin: mockUsers[4],
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) => {
        const found = mockUsers.find((u) => u.email === email) ?? mockUsers[0]
        set({ user: found, isAuthenticated: true })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      switchRole: (role: Role) => {
        set({ user: roleUsers[role], isAuthenticated: true })
      },
    }),
    { name: 'sportspulse-auth' }
  )
)

export const ROLE_PERMISSIONS: Record<string, Role[]> = {
  viewPublic: ['user', 'editor', 'moderator', 'admin', 'superadmin'],
  comment: ['user', 'editor', 'moderator', 'admin', 'superadmin'],
  writePost: ['editor', 'moderator', 'admin', 'superadmin'],
  editOwnPost: ['editor', 'moderator', 'admin', 'superadmin'],
  editAnyPost: ['moderator', 'admin', 'superadmin'],
  moderateComments: ['moderator', 'admin', 'superadmin'],
  banUser: ['moderator', 'admin', 'superadmin'],
  manageUsers: ['admin', 'superadmin'],
  assignRoles: ['admin', 'superadmin'],
  viewAuditLogs: ['admin', 'superadmin'],
  systemSettings: ['superadmin'],
}

export function hasPermission(role: Role | undefined, permission: string): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[permission]?.includes(role) ?? false
}