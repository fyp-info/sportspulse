import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Users, Calendar } from 'lucide-react'
import { matchDetails, type MatchDetail } from '@/lib/mock-data/football'
import { prisma } from '@/lib/prisma'
import { mockSlice, SPORT_LEAGUE_KEYS } from '@/lib/sports-data'

interface Props {
  params: Promise<{ matchId: string }>
}

// Detailed stats pages aren't editable yet, so a match created/edited from the
// dashboard (or an upcoming fixture) won't have a rich entry in `matchDetails`.
// Fall back to a basic header built from the live scores/schedule data so the
// card links never 404.
async function basicMatch(matchId: string): Promise<MatchDetail | null> {
  const rows = await prisma.sportsData.findMany({
    where: { sport: 'football', tab: { in: ['scores', 'schedule'] } },
  })
  const saved = new Map(rows.map((r) => [`${r.league}::${r.tab}`, r.data]))
  for (const league of SPORT_LEAGUE_KEYS.football) {
    for (const tab of ['scores', 'schedule']) {
      const key = `${league}::${tab}`
      const list = saved.has(key) ? saved.get(key) : mockSlice('football', league, tab)
      if (!Array.isArray(list)) continue
      const hit = list.find((m) => m && (m as { id?: string }).id === matchId) as Record<string, unknown> | undefined
      if (hit) {
        return {
          id: String(hit.id),
          homeTeam: String(hit.homeTeam ?? ''),
          awayTeam: String(hit.awayTeam ?? ''),
          homeScore: hit.homeScore == null ? null : Number(hit.homeScore),
          awayScore: hit.awayScore == null ? null : Number(hit.awayScore),
          status: String(hit.status ?? 'vs'),
          competition: String(hit.competition ?? league),
          league: String(hit.league ?? league),
          date: String(hit.date ?? ''),
          time: String(hit.time ?? ''),
          venue: String(hit.venue ?? ''),
          homeFlag: hit.homeFlag as string | undefined,
          awayFlag: hit.awayFlag as string | undefined,
          referee: '—',
          attendance: '—',
        }
      }
    }
  }
  return null
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1
  const hp = Math.round((home / total) * 100)
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-gray-900 tabular-nums">{home}</span>
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">{away}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden">
        <div className="bg-orange-500 rounded-l-full transition-all" style={{ width: `${hp}%` }} />
        <div className="bg-blue-400 rounded-r-full transition-all" style={{ width: `${100 - hp}%` }} />
      </div>
    </div>
  )
}

export default async function MatchDetailPage({ params }: Props) {
  const { matchId } = await params
  const dbMatch = await basicMatch(matchId)
  const richMock = matchDetails[matchId]
  // DB wins for all live-editable fields; mock fills in rich supplementary data (goals, stats, lineups).
  const match: MatchDetail | null = dbMatch
    ? ({
        ...(richMock ?? {}),
        id: dbMatch.id,
        homeTeam: dbMatch.homeTeam,
        awayTeam: dbMatch.awayTeam,
        homeScore: dbMatch.homeScore,
        awayScore: dbMatch.awayScore,
        status: dbMatch.status,
        competition: dbMatch.competition,
        league: dbMatch.league,
        date: dbMatch.date,
        time: dbMatch.time,
        venue: dbMatch.venue || richMock?.venue || '',
        homeFlag: dbMatch.homeFlag ?? richMock?.homeFlag,
        awayFlag: dbMatch.awayFlag ?? richMock?.awayFlag,
        referee: richMock?.referee ?? '—',
        attendance: richMock?.attendance ?? '—',
      } as MatchDetail)
    : (richMock ?? null)
  if (!match) notFound()

  const isUpcoming = match.homeScore === null
  const homeWon = !isUpcoming && match.homeScore! > match.awayScore!
  const awayWon = !isUpcoming && match.awayScore! > match.homeScore!

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/sports/football"
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Football
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
              <div className="h-14 w-14 mx-auto mb-3 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
                {match.homeFlag ?? '⚽'}
              </div>
              <div
                className={`font-bold text-sm leading-tight ${homeWon ? 'text-orange-400' : 'text-white'}`}
              >
                {match.homeTeam}
              </div>
            </div>

            {/* Score block */}
            <div className="text-center shrink-0 min-w-28">
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
                <>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span
                      className={`text-5xl font-black tabular-nums ${homeWon ? 'text-orange-400' : 'text-white'}`}
                    >
                      {match.homeScore}
                    </span>
                    <span className="text-gray-500 text-3xl font-light">–</span>
                    <span
                      className={`text-5xl font-black tabular-nums ${awayWon ? 'text-orange-400' : 'text-white'}`}
                    >
                      {match.awayScore}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      match.status === 'FT'
                        ? 'bg-green-500/20 text-green-400'
                        : match.status === 'HT'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {match.status}
                  </span>
                </>
              )}
            </div>

            {/* Away team */}
            <div className="text-center flex-1 min-w-0">
              <div className="h-14 w-14 mx-auto mb-3 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
                {match.awayFlag ?? '⚽'}
              </div>
              <div
                className={`font-bold text-sm leading-tight ${awayWon ? 'text-orange-400' : 'text-white'}`}
              >
                {match.awayTeam}
              </div>
            </div>
          </div>

          {/* Venue / date */}
          <div className="flex items-center justify-center gap-3 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.venue}
            </span>
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

        {/* Goals timeline */}
        {!isUpcoming && match.goals && match.goals.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Goals</h3>
            <div className="space-y-2">
              {match.goals.map((goal, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${goal.team === 'home' ? '' : 'flex-row-reverse'}`}
                >
                  <span className="text-orange-400 text-base">⚽</span>
                  <span className="font-medium text-gray-800">{goal.scorer}</span>
                  {goal.type !== 'goal' && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full capitalize">
                      {goal.type}
                    </span>
                  )}
                  <span className="text-gray-400 text-xs font-mono ml-auto">{goal.minute}&apos;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming notice */}
        {isUpcoming && (
          <div className="px-5 py-4 border-t border-gray-100 bg-orange-50 text-center">
            <p className="text-sm font-medium text-orange-600">
              Match not yet played ·{' '}
              {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {match.time}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      {!isUpcoming && match.stats && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-bold text-orange-500 flex-1 truncate">{match.homeTeam}</span>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4">Match Stats</h3>
            <span className="text-sm font-bold text-blue-500 flex-1 text-right truncate">{match.awayTeam}</span>
          </div>
          <StatBar label="Possession %" home={match.stats.possession[0]} away={match.stats.possession[1]} />
          <StatBar label="Shots on Target" home={match.stats.shotsOnTarget[0]} away={match.stats.shotsOnTarget[1]} />
          <StatBar label="Total Shots" home={match.stats.totalShots[0]} away={match.stats.totalShots[1]} />
          <StatBar label="Pass Accuracy %" home={match.stats.passAccuracy[0]} away={match.stats.passAccuracy[1]} />
          <StatBar label="Corners" home={match.stats.corners[0]} away={match.stats.corners[1]} />
          <StatBar label="Fouls" home={match.stats.fouls[0]} away={match.stats.fouls[1]} />
          <StatBar label="Yellow Cards" home={match.stats.yellowCards[0]} away={match.stats.yellowCards[1]} />
          <StatBar label="Saves" home={match.stats.saves[0]} away={match.stats.saves[1]} />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400 font-medium pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />{match.homeTeam}
            </span>
            <span className="flex items-center gap-1.5">
              {match.awayTeam}<span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
            </span>
          </div>
        </div>
      )}

      {/* Lineups */}
      {match.homeLineup && match.homeLineup.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Starting Lineups
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: match.homeTeam, lineup: match.homeLineup, subs: match.homeSubs },
              { label: match.awayTeam, lineup: match.awayLineup ?? [], subs: match.awaySubs },
            ].map((side) => (
              <div key={side.label}>
                <h4 className="text-xs font-bold text-gray-700 mb-3 truncate">{side.label}</h4>
                <ol className="space-y-1.5">
                  {side.lineup.map((player, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-300 font-mono w-4 text-right shrink-0">{i + 1}</span>
                      <span className="text-gray-700">{player}</span>
                    </li>
                  ))}
                </ol>
                {side.subs && side.subs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1.5">Substitutes</div>
                    {side.subs.map((sub, i) => (
                      <div key={i} className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <span className="text-green-500 font-bold">↔</span>
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match info */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-300" />
            <span className="text-gray-400">Referee:</span>
            <span className="font-semibold text-gray-700">{match.referee}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-300" />
            <span className="text-gray-400">Attendance:</span>
            <span className="font-semibold text-gray-700">{match.attendance}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-300" />
            <span className="font-semibold text-gray-700">{match.venue}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
