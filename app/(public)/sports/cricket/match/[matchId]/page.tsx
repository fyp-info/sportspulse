import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { mockSlice, SPORT_LEAGUE_KEYS } from '@/lib/sports-data'
import type { CricketMatch } from '@/lib/mock-data/cricket'

interface Props {
  params: Promise<{ matchId: string }>
}

async function findCricketMatch(matchId: string): Promise<CricketMatch | null> {
  const rows = await prisma.sportsData.findMany({
    where: { sport: 'cricket', tab: { in: ['scores', 'schedule'] } },
  })
  const saved = new Map(rows.map((r) => [`${r.league}::${r.tab}`, r.data]))

  for (const league of SPORT_LEAGUE_KEYS.cricket) {
    for (const tab of ['scores', 'schedule']) {
      const key = `${league}::${tab}`
      const list: unknown = saved.has(key) ? saved.get(key) : mockSlice('cricket', league, tab)
      if (!Array.isArray(list)) continue
      const hit = list.find((m) => m && (m as { id?: string }).id === matchId)
      if (hit) return hit as CricketMatch
    }
  }
  return null
}

function relativeLabel(date: string): string | null {
  const diff = Math.round((new Date(date).getTime() - Date.now()) / 86400000)
  if (diff < 0 || diff > 60) return null
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

function leadingFlag(name: string): string | null {
  const m = name.match(/^(\p{Regional_Indicator}{2})/u)
  return m ? m[1] : null
}

function stripFlag(name: string): string {
  return name.replace(/^(?:\p{Regional_Indicator}{2})\s*/u, '')
}

const CREST_COLORS = [
  'from-orange-400 to-orange-600',
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-cyan-500 to-cyan-700',
  'from-amber-400 to-amber-600',
  'from-indigo-400 to-indigo-600',
]

function crestColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return CREST_COLORS[h % CREST_COLORS.length]
}

function TeamCrest({ name }: { name: string }) {
  const flag = leadingFlag(name)
  if (flag) {
    return (
      <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 border border-white/20 text-3xl">
        {flag}
      </span>
    )
  }
  const initials = stripFlag(name).split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className={`inline-flex items-center justify-center h-14 w-14 rounded-full bg-linear-to-br text-white font-bold text-base shadow-sm ${crestColor(name)}`}>
      {initials}
    </span>
  )
}

export default async function CricketMatchPage({ params }: Props) {
  const { matchId } = await params
  const match = await findCricketMatch(matchId)
  if (!match) notFound()

  const isUpcoming = match.status === 'Upcoming' || match.homeScore === null
  const homeWon = match.winner === 'home'
  const awayWon = match.winner === 'away'
  const rel = relativeLabel(match.date)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/sports/cricket"
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cricket
      </Link>

      {/* Match Header */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="bg-linear-to-br from-gray-900 to-gray-800 px-6 py-8 text-white">
          {/* Competition */}
          <div className="text-center mb-6">
            <span className="text-xs font-semibold bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              {match.competition}
            </span>
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-4">
            {/* Home team */}
            <div className="text-center flex-1 min-w-0">
              <div className="flex justify-center mb-3">
                <TeamCrest name={match.homeTeam} />
              </div>
              <div className={`font-bold text-sm leading-tight ${homeWon ? 'text-orange-400' : 'text-white'}`}>
                {stripFlag(match.homeTeam)}
              </div>
              {!isUpcoming && (
                <div className={`text-xl font-black mt-2 tabular-nums ${homeWon ? 'text-orange-400' : 'text-gray-300'}`}>
                  {match.homeScore}
                </div>
              )}
            </div>

            {/* Centre block */}
            <div className="text-center shrink-0 min-w-24">
              {isUpcoming ? (
                <>
                  <div className="text-3xl font-black text-gray-400 mb-1">vs</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    <span className="mx-0.5">·</span>
                    {match.time}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-light text-gray-500">vs</div>
              )}
            </div>

            {/* Away team */}
            <div className="text-center flex-1 min-w-0">
              <div className="flex justify-center mb-3">
                <TeamCrest name={match.awayTeam} />
              </div>
              <div className={`font-bold text-sm leading-tight ${awayWon ? 'text-orange-400' : 'text-white'}`}>
                {stripFlag(match.awayTeam)}
              </div>
              {!isUpcoming && (
                <div className={`text-xl font-black mt-2 tabular-nums ${awayWon ? 'text-orange-400' : 'text-gray-300'}`}>
                  {match.awayScore}
                </div>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>{match.venue}</span>
            {!isUpcoming && (
              <>
                <span>·</span>
                <span>
                  {new Date(match.date).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Result banner */}
        {!isUpcoming && match.result && (
          <div className="px-5 py-4 border-t border-gray-100 bg-orange-50 text-center">
            <p className="text-sm font-semibold text-orange-600">🏏 {match.result}</p>
          </div>
        )}

        {/* Upcoming notice */}
        {isUpcoming && (
          <div className="px-5 py-4 border-t border-gray-100 bg-orange-50 text-center">
            <p className="text-sm font-medium text-orange-600">
              {rel ? `${rel} · ` : ''}
              {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {match.time}
            </p>
          </div>
        )}
      </div>

      {/* Match Info */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-300" />
            <span className="text-gray-400">Date:</span>
            <span className="font-semibold text-gray-700">
              {new Date(match.date).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-300" />
            <span className="font-semibold text-gray-700">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* Scorecard placeholder */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center">
        <p className="text-3xl mb-3">🏏</p>
        <p className="text-sm font-semibold text-gray-600">Detailed scorecard coming soon</p>
        <p className="text-xs text-gray-400 mt-1">Batting & bowling figures will appear here</p>
      </div>
    </div>
  )
}
