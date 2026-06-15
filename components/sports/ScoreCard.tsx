import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'

const sportVariants: Record<string, 'football' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  Cricket: 'cricket',
  F1: 'formula-1',
}

interface NormalizedScore {
  id: string
  sport: string
  competition: string
  homeTeam: string
  awayTeam: string
  homeScore: string | number
  awayScore: string | number
  status: string
  date: string
}

const MAX_PER_SPORT = 3

async function fetchRecentScores(): Promise<NormalizedScore[]> {
  const [scoreRows, f1Rows] = await Promise.all([
    prisma.sportsData.findMany({
      where: { tab: 'scores', sport: { in: ['football', 'cricket'] } },
    }),
    prisma.sportsData.findMany({
      where: { sport: 'formula-1', tab: 'races', league: '2026' },
    }),
  ])

  const perSport: Record<string, NormalizedScore[]> = {
    Football: [],
    Cricket: [],
    F1: [],
  }

  for (const row of scoreRows) {
    const data = Array.isArray(row.data) ? (row.data as Record<string, unknown>[]) : []
    const label = row.sport === 'football' ? 'Football' : 'Cricket'
    for (const m of data) {
      if (m.status !== 'FT') continue
      perSport[label].push({
        id: String(m.id ?? `${row.sport}-${row.league}-${m.homeTeam}`),
        sport: label,
        competition: String(m.competition ?? row.league),
        homeTeam: String(m.homeTeam ?? ''),
        awayTeam: String(m.awayTeam ?? ''),
        homeScore: (m.homeScore ?? '') as string | number,
        awayScore: (m.awayScore ?? '') as string | number,
        status: 'FT',
        date: String(m.date ?? ''),
      })
    }
  }

  // F1 completed races: winner is shown as home, position-2 as away
  for (const row of f1Rows) {
    const data = Array.isArray(row.data) ? (row.data as Record<string, unknown>[]) : []
    for (const r of data) {
      if (!r.winner) continue
      perSport.F1.push({
        id: `f1-${row.league}-${r.round}`,
        sport: 'F1',
        competition: String(r.grandPrix ?? ''),
        homeTeam: `${r.winnerFlag ?? ''} ${r.winner ?? ''}`.trim(),
        awayTeam: String(r.circuit ?? ''),
        homeScore: `P1`,
        awayScore: String(r.team ?? ''),
        status: 'Race Over',
        date: String(r.date ?? ''),
      })
    }
  }

  // Sort each sport by date desc, cap at MAX_PER_SPORT
  const result: NormalizedScore[] = []
  for (const label of ['Football', 'Cricket', 'F1']) {
    const sorted = perSport[label]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_PER_SPORT)
    result.push(...sorted)
  }

  // Deduplicate by id, cap at 7 total
  const seen = new Set<string>()
  return result
    .filter((s) => {
      if (seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })
    .slice(0, 7)
}

export default async function ScoreCard() {
  const scores = await fetchRecentScores()

  if (scores.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-400 text-center py-4">No recent scores available.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {scores.map((score) => (
        <div
          key={score.id}
          className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Badge variant={sportVariants[score.sport] ?? 'default'} className="text-[10px]">
              {score.competition}
            </Badge>
            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              {score.status}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-800 flex-1 text-right truncate">
              {score.homeTeam}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xl font-black text-gray-900">{score.homeScore}</span>
              <span className="text-gray-300 text-sm">-</span>
              <span className="text-xl font-black text-gray-900">{score.awayScore}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 flex-1 truncate">
              {score.awayTeam}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
