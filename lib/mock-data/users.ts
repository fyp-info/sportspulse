export type Role = 'user' | 'editor' | 'moderator' | 'admin' | 'superadmin'

export interface User {
  id: string
  username: string
  email: string
  role: Role
  avatar: string
  bio: string
  createdAt: string
  lastLogin: string
  isActive: boolean
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@sportspulse.com',
    role: 'user',
    avatar: '',
    bio: 'Die-hard football fan and weekend warrior.',
    createdAt: '2025-01-15',
    lastLogin: '2026-06-10',
    isActive: true,
  },
  {
    id: '2',
    username: 'sarah_editor',
    email: 'sarah@sportspulse.com',
    role: 'editor',
    avatar: '',
    bio: 'Sports journalist with 8 years of experience.',
    createdAt: '2024-11-20',
    lastLogin: '2026-06-11',
    isActive: true,
  },
  {
    id: '3',
    username: 'mike_mod',
    email: 'mike@sportspulse.com',
    role: 'moderator',
    avatar: '',
    bio: 'Keeping the community clean and respectful.',
    createdAt: '2024-08-05',
    lastLogin: '2026-06-11',
    isActive: true,
  },
  {
    id: '4',
    username: 'admin_alex',
    email: 'alex@sportspulse.com',
    role: 'admin',
    avatar: '',
    bio: 'Platform administrator.',
    createdAt: '2024-03-01',
    lastLogin: '2026-06-11',
    isActive: true,
  },
  {
    id: '5',
    username: 'superadmin',
    email: 'super@sportspulse.com',
    role: 'superadmin',
    avatar: '',
    bio: 'System owner and super administrator.',
    createdAt: '2024-01-01',
    lastLogin: '2026-06-11',
    isActive: true,
  },
]

export const mockSessions = [
  { id: '1', device: 'Chrome / Windows 11', ip: '192.168.1.10', location: 'New York, US', lastActive: '2 minutes ago', current: true },
  { id: '2', device: 'Safari / iPhone 15', ip: '192.168.1.22', location: 'New York, US', lastActive: '1 hour ago', current: false },
  { id: '3', device: 'Firefox / macOS', ip: '10.0.0.5', location: 'London, UK', lastActive: '3 days ago', current: false },
]

export const loginHistory = [
  { id: '1', date: '2026-06-11 08:42', ip: '192.168.1.10', device: 'Chrome / Windows 11', location: 'New York, US', status: 'success' },
  { id: '2', date: '2026-06-10 19:15', ip: '192.168.1.22', device: 'Safari / iPhone 15', location: 'New York, US', status: 'success' },
  { id: '3', date: '2026-06-09 14:02', ip: '203.44.12.3', device: 'Unknown', location: 'Lagos, NG', status: 'failed' },
  { id: '4', date: '2026-06-08 10:30', ip: '10.0.0.5', device: 'Firefox / macOS', location: 'London, UK', status: 'success' },
]

export const auditLogs = [
  { id: '1', user: 'admin_alex', action: 'Banned user spam_bot_99', target: 'spam_bot_99', date: '2026-06-11 09:01', ip: '192.168.1.1' },
  { id: '2', user: 'sarah_editor', action: 'Published article "UCL Final Preview"', target: 'article-ucl-final', date: '2026-06-11 08:30', ip: '192.168.1.5' },
  { id: '3', user: 'mike_mod', action: 'Approved 12 pending comments', target: 'comments-batch', date: '2026-06-11 08:15', ip: '192.168.1.9' },
  { id: '4', user: 'admin_alex', action: 'Changed user role: john_doe → editor', target: 'john_doe', date: '2026-06-10 17:45', ip: '192.168.1.1' },
  { id: '5', user: 'superadmin', action: 'Updated password policy', target: 'system-settings', date: '2026-06-10 12:00', ip: '192.168.1.100' },
]

export const failedLoginAttempts = [
  { id: '1', ip: '203.44.12.3', attempts: 8, lastAttempt: '2026-06-11 08:55', country: 'NG', blocked: true },
  { id: '2', ip: '45.155.205.100', attempts: 3, lastAttempt: '2026-06-11 07:20', country: 'RU', blocked: false },
  { id: '3', ip: '185.220.101.5', attempts: 15, lastAttempt: '2026-06-10 23:40', country: 'NL', blocked: true },
]

export const ipBlockList = [
  { id: '1', ip: '203.44.12.3', reason: 'Brute force attempt', addedBy: 'admin_alex', date: '2026-06-11' },
  { id: '2', ip: '185.220.101.5', reason: 'Bot scraping', addedBy: 'superadmin', date: '2026-06-10' },
]