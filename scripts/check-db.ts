import { prisma } from '../lib/prisma'

async function main() {
  const scoreRows = await prisma.sportsData.findMany({
    where: { tab: 'scores', sport: { in: ['football', 'cricket'] } },
  })
  let total = 0, ftCount = 0
  for (const r of scoreRows) {
    const arr = Array.isArray(r.data) ? (r.data as Record<string,unknown>[]) : []
    total += arr.length
    ftCount += arr.filter((m) => m.status === 'FT').length
  }
  console.log('Score rows in DB:', scoreRows.length)
  console.log('Total match entries:', total, '| FT entries:', ftCount)
  const sample = scoreRows
    .flatMap((r) => (Array.isArray(r.data) ? (r.data as Record<string,unknown>[]) : []))
    .filter((m) => m.status === 'FT')
    .slice(0, 1)
  if (sample.length) console.log('Sample FT entry:', JSON.stringify(sample[0]))

  const schedRows = await prisma.sportsData.findMany({
    where: { tab: 'schedule', sport: { in: ['football', 'cricket'] } },
  })
  let upcoming = 0
  for (const r of schedRows) {
    const arr = Array.isArray(r.data) ? (r.data as Record<string,unknown>[]) : []
    upcoming += arr.filter((m) => m.status === 'Upcoming' || m.homeScore == null).length
  }
  console.log('Schedule rows:', schedRows.length, '| Upcoming entries:', upcoming)

  const posts = await prisma.post.count({ where: { status: 'published' } })
  const featured = await prisma.post.count({ where: { featured: true, status: 'published' } })
  console.log('Published posts:', posts, '| Featured posts:', featured)
  const fp = await prisma.post.findFirst({ where: { featured: true, status: 'published' }, select: { title: true, sport: true } })
  if (fp) console.log('Sample featured post:', fp.title, '| sport:', fp.sport)
}

main().catch(console.error).finally(() => prisma.$disconnect())
