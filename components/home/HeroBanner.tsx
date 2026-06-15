import { prisma } from '@/lib/prisma'
import HeroBannerClient, { type BannerData, type BannerStats } from './HeroBannerClient'

const DEFAULT_BANNER: BannerData = {
  badge:        'Watch Stats and Score',
  headline:     'Your Pulse on the World of Sports',
  accentWord:   'Pulse',
  description:  'Football, Cricket, Formula-1 — breaking news, live scores, standings, and expert analysis all in one place.',
  primaryBtn:   'Latest News',
  primaryUrl:   '/blog',
  secondaryBtn: 'Explore Sports',
  secondaryUrl: '/sports/football',
  imageUrl:     '/Sport-banner.jpg',
}

export default async function HeroBanner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any

  const [dbBanner, blogCount, readerCount, sportCount] = await Promise.all([
    db.homeBanner?.findFirst?.() ?? Promise.resolve(null),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.sportsData.groupBy({ by: ['sport'] }).then((r) => r.length),
  ])

  const banner: BannerData = dbBanner
    ? {
        badge:        dbBanner.badge,
        headline:     dbBanner.headline,
        accentWord:   dbBanner.accentWord,
        description:  dbBanner.description,
        primaryBtn:   dbBanner.primaryBtn,
        primaryUrl:   dbBanner.primaryUrl,
        secondaryBtn: dbBanner.secondaryBtn,
        secondaryUrl: dbBanner.secondaryUrl,
        imageUrl:     dbBanner.imageUrl,
      }
    : DEFAULT_BANNER

  const stats: BannerStats = {
    blogs:   blogCount,
    readers: readerCount,
    sports:  sportCount || 3,
  }

  return <HeroBannerClient banner={banner} stats={stats} />
}
