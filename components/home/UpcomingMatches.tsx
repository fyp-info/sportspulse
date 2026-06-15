import { Calendar, MapPin, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'

const sportVariants: Record<string, 'football' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  F1: 'formula-1',
  Cricket: 'cricket',
}

interface UpcomingItem {
  id: string
  sport: string
  competition: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
}

async function fetchUpcoming(): Promise<UpcomingItem[]> {
  const today = new Date().toISOString().slice(0, 10)

  const [scheduleRows, f1Rows] = await Promise.all([
    prisma.sportsData.findMany({
      where: { tab: 'schedule', sport: { in: ['football', 'cricket'] } },
    }),
    prisma.sportsData.findMany({
      where: { sport: 'formula-1', tab: 'schedule', league: '2026' },
    }),
  ])

  const items: UpcomingItem[] = []

  for (const row of scheduleRows) {
    const data = Array.isArray(row.data) ? (row.data as Record<string, unknown>[]) : []
    const label = row.sport === 'football' ? 'Football' : 'Cricket'
    for (const m of data) {
      const date = String(m.date ?? '')
      const status = String(m.status ?? '')
      // Must be today or future, AND either no score set or explicitly marked upcoming/vs
      const hasNoScore = m.homeScore == null && m.awayScore == null
      const isUpcoming = date >= today && (hasNoScore || status === 'Upcoming' || status === 'vs')
      if (!isUpcoming || !date) continue
      items.push({
        id: String(m.id ?? `${row.sport}-${row.league}-${m.homeTeam}`),
        sport: label,
        competition: String(m.competition ?? row.league),
        homeTeam: String(m.homeTeam ?? ''),
        awayTeam: String(m.awayTeam ?? ''),
        date,
        time: String(m.time ?? ''),
        venue: String(m.venue ?? ''),
      })
    }
  }

  for (const row of f1Rows) {
    const data = Array.isArray(row.data) ? (row.data as Record<string, unknown>[]) : []
    for (const r of data) {
      if (r.status !== 'upcoming') continue
      const raceDate = String(r.raceDate ?? '')
      if (!raceDate || raceDate < today) continue
      items.push({
        id: `f1-2026-${r.round}`,
        sport: 'F1',
        competition: 'Formula 1',
        homeTeam: `${r.flag ?? ''} ${r.grandPrix ?? ''}`.trim(),
        awayTeam: String(r.circuit ?? ''),
        date: raceDate,
        time: '14:00',
        venue: String(r.country ?? ''),
      })
    }
  }

  const seen = new Set<string>()
  return items
    .filter((m) => {
      if (!m.homeTeam || !m.awayTeam) return false
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 9)
}

export default async function UpcomingMatches() {
  const matches = await fetchUpcoming()

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Upcoming Matches</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {matches.length} events
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-4xl">📅</span>
          <p className="text-sm font-semibold text-gray-600">No upcoming matches scheduled</p>
          <p className="text-xs text-gray-400">Add fixtures from the dashboard to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={sportVariants[match.sport] ?? 'default'}>{match.sport}</Badge>
                <span className="text-xs text-gray-400 truncate ml-2">{match.competition}</span>
              </div>

              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-semibold text-gray-800 text-sm text-center flex-1 truncate">
                  {match.homeTeam}
                </span>
                <span className="text-xs font-bold text-orange-500 px-2 py-1 rounded-lg bg-orange-50 shrink-0">
                  VS
                </span>
                <span className="font-semibold text-gray-800 text-sm text-center flex-1 truncate">
                  {match.awayTeam}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                {match.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {match.time}
                  </span>
                )}
                {match.venue && (
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{match.venue}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
