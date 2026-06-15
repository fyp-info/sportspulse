/**
 * Seed the database from the existing mock-data files.
 * Run with: npx prisma db seed   (configured in prisma.config.ts)
 */
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

import { mockUsers, mockSessions, auditLogs, failedLoginAttempts, ipBlockList, suspiciousIPs } from '../lib/mock-data/users'
import { mockPosts, mockComments } from '../lib/mock-data/posts'
import { mockContacts } from '../lib/mock-data/contact'
import { mockNotifications } from '../lib/mock-data/notifications'
import { SPORT_LEAGUE_KEYS, SPORT_TABS, mockSlice, type SportKey } from '../lib/sports-data'

try { process.loadEnvFile() } catch { /* env already injected */ }

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) })

// Every seeded account shares this password so you can log in immediately.
const DEMO_PASSWORD = 'Sportspulse@123'

const d = (s: string) => new Date(s.includes(' ') ? s.replace(' ', 'T') : s)

async function main() {
  console.log('🧹 Clearing existing data…')
  // Delete in FK-dependency order.
  await prisma.bookmark.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.loginHistory.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.failedLogin.deleteMany()
  await prisma.blockedIp.deleteMany()
  await prisma.suspiciousIp.deleteMany()
  await prisma.legalDoc.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.sportsData.deleteMany()
  await prisma.user.deleteMany()

  console.log('👤 Seeding users…')
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
  const usersByUsername = new Map<string, string>() // username -> new id
  const usersByEmail = new Map<string, string>()

  for (const u of mockUsers) {
    const created = await prisma.user.create({
      data: {
        username: u.username,
        name: u.name ?? '',
        email: u.email,
        passwordHash,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        isActive: u.isActive,
        emailVerified: true,
        createdAt: d(u.createdAt),
        lastLogin: d(u.lastLogin),
      },
    })
    usersByUsername.set(u.username, created.id)
    usersByEmail.set(u.email, created.id)
  }

  console.log('📝 Seeding posts…')
  const postIdMap = new Map<string, string>() // mock id -> new id
  for (const p of mockPosts) {
    const authorId = usersByEmail.get(p.authorEmail) ?? usersByUsername.get(p.author) ?? [...usersByUsername.values()][0]
    const created = await prisma.post.create({
      data: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        sport: p.sport,
        category: p.category,
        authorId: authorId!,
        image: p.image,
        views: p.views,
        likes: p.likes,
        shares: p.shares,
        status: p.status === 'scheduled' ? 'draft' : p.status,
        featured: p.featured,
        tags: p.tags,
        publishedAt: p.status === 'published' ? d(p.publishedAt) : null,
        createdAt: d(p.publishedAt),
      },
    })
    postIdMap.set(p.id, created.id)
  }

  console.log('💬 Seeding comments…')
  for (const c of mockComments) {
    const postId = postIdMap.get(c.postId)
    if (!postId) continue // skip comments whose post doesn't exist in mock posts
    await prisma.comment.create({
      data: {
        postId,
        userId: usersByUsername.get(c.author) ?? null,
        authorName: c.author,
        content: c.content,
        status: c.status,
        reported: c.reported,
        createdAt: d(c.date),
      },
    })
  }

  console.log('🖥️  Seeding sessions (superadmin)…')
  const superId = usersByUsername.get('superadmin')!
  for (const s of mockSessions) {
    await prisma.session.create({
      data: { userId: superId, device: s.device, ip: s.ip, location: s.location, current: s.current },
    })
  }

  console.log('📨 Seeding contact messages…')
  for (const m of mockContacts) {
    await prisma.contactMessage.create({
      data: { name: m.name, email: m.email, subject: m.subject, message: m.message, read: m.read, replied: m.replied, createdAt: d(m.date) },
    })
  }

  console.log('🔔 Seeding notifications…')
  for (const n of mockNotifications) {
    await prisma.notification.create({
      data: { category: n.category, title: n.title, body: n.body, href: n.href, read: n.read },
    })
  }

  console.log('📋 Seeding audit logs…')
  for (const a of auditLogs) {
    await prisma.auditLog.create({
      data: { actor: a.user, action: a.action, target: a.target, ip: a.ip, createdAt: d(a.date) },
    })
  }

  console.log('🚫 Seeding failed logins / blocked & suspicious IPs…')
  for (const f of failedLoginAttempts) {
    await prisma.failedLogin.create({
      data: { ip: f.ip, attempts: f.attempts, lastAttempt: d(f.lastAttempt), country: f.country, blocked: f.blocked },
    })
  }
  for (const b of ipBlockList) {
    await prisma.blockedIp.create({
      data: { ip: b.ip, reason: b.reason, addedBy: b.addedBy, createdAt: d(b.date) },
    })
  }
  for (const s of suspiciousIPs) {
    await prisma.suspiciousIp.create({
      data: { ip: s.ip, country: s.country, city: s.city, network: s.network, status: s.status, threat: s.threat, attempts: s.attempts, lastSeen: d(s.lastSeen) },
    })
  }

  console.log('📜 Seeding legal docs…')
  for (const type of ['privacy', 'terms'] as const) {
    await prisma.legalDoc.create({ data: { type, content: { sections: [] } } })
  }

  console.log('🏆 Seeding sports data (per league + tab)…')
  for (const sport of ['football', 'cricket', 'formula-1'] as SportKey[]) {
    for (const league of SPORT_LEAGUE_KEYS[sport]) {
      for (const tab of SPORT_TABS[sport]) {
        await prisma.sportsData.create({
          data: { sport, league, tab, data: mockSlice(sport, league, tab) as object },
        })
      }
    }
  }

  console.log('✅ Seed complete.')
  console.log(`\n   Login with any seeded account, e.g.:`)
  console.log(`   • super@sportspulse.com  (superadmin)`)
  console.log(`   • alex@sportspulse.com   (admin)`)
  console.log(`   • sarah@sportspulse.com  (editor)`)
  console.log(`   • mike@sportspulse.com   (moderator)`)
  console.log(`   • john@sportspulse.com   (user)`)
  // Seed default HomeBanner (upsert so re-runs don't duplicate)
  await prisma.homeBanner.deleteMany()
  await prisma.homeBanner.create({
    data: {
      badge:        'Watch Stats and Score',
      headline:     'Your Pulse on the World of Sports',
      accentWord:   'Pulse',
      description:  'Football, Cricket, Formula-1 — breaking news, live scores, standings, and expert analysis all in one place.',
      primaryBtn:   'Latest News',
      primaryUrl:   '/blog',
      secondaryBtn: 'Explore Sports',
      secondaryUrl: '/sports/football',
      imageUrl:     '/Sport-banner.jpg',
      updatedBy:    'seed',
    },
  })
  console.log('🏠 Seeded HomeBanner')

  console.log(`   Password for all: ${DEMO_PASSWORD}\n`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
