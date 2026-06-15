'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ArticleCard from '@/components/blog/ArticleCard'
import PlayerProfile from '@/components/sports/PlayerProfile'
import TournamentBracket, { type BracketRound } from '@/components/sports/TournamentBracket'
import { cn } from '@/lib/utils'
import { mockPosts } from '@/lib/mock-data/posts'
import {
  FOOTBALL_LEAGUES,
  leagueStandings,
  leagueScores,
  leagueSchedule,
  footballPlayerDetails,
  type FormResult,
  type ZoneType,
  type FootballStanding,
} from '@/lib/mock-data/football'
import { DEFAULT_FOOTBALL_BRACKET, SPORT_LEAGUE_KEYS } from '@/lib/sports-data'

function FormPill({ result }: { result: FormResult }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center h-4 w-4 rounded-full text-[8px] font-bold',
      result === 'W' && 'bg-green-500 text-white',
      result === 'D' && 'bg-gray-300 text-gray-600',
      result === 'L' && 'bg-red-400 text-white',
    )}>{result}</span>
  )
}

const ZONE_BADGE: Record<ZoneType, string> = {
  ucl: 'bg-blue-500 text-white',
  europa: 'bg-orange-400 text-white',
  conference: 'bg-green-500 text-white',
  relegation: 'bg-red-400 text-white',
  '': 'bg-gray-100 text-gray-500',
}

// --- Team crest helpers ---
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

function TeamCrest({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'
  const initials = stripFlag(name).split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-full bg-linear-to-br text-white font-bold shrink-0 shadow-sm',
      box,
      size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-base' : 'text-xs',
      crestColor(name),
    )}>
      {initials}
    </span>
  )
}

function relativeLabel(date: string): string | null {
  const diff = Math.round((new Date(date).getTime() - Date.now()) / 86400000)
  if (diff < 0 || diff > 60) return null
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

export default function FootballPage() {
  const [selectedLeague, setSelectedLeague] = useState('Premier League')

  // Live admin-managed data (mock stays as the fallback so the page is never blank).
  const [remote, setRemote] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch('/api/sports/football', { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => { if (!cancelled) setRemote(res.data ?? {}) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sliceArr = (lg: string, tab: string): any[] | null => {
    const v = remote?.[`${lg}::${tab}`]
    return Array.isArray(v) ? v : null
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeAll = (tab: string): any[] => SPORT_LEAGUE_KEYS.football.flatMap((lg) => sliceArr(lg, tab) ?? [])

  const currentLeague = useMemo(
    () => FOOTBALL_LEAGUES.find((l) => l.id === selectedLeague) ?? FOOTBALL_LEAGUES[0],
    [selectedLeague]
  )

  const filteredPosts = useMemo(() => {
    const fp = mockPosts.filter((p) => p.sport === 'Football' && p.status === 'published')
    if (selectedLeague === 'all') return fp
    return fp.filter(
      (p) =>
        p.category === selectedLeague ||
        p.tags.some((t) => t.toLowerCase().includes(selectedLeague.toLowerCase().split(' ')[0]))
    )
  }, [selectedLeague])

  const standings = useMemo(() => {
    const key = selectedLeague === 'all' ? 'Premier League' : selectedLeague
    return (sliceArr(key, 'standings') ?? leagueStandings[key] ?? leagueStandings['Premier League']) as FootballStanding[]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, remote])

  const scores = useMemo(() => {
    if (selectedLeague === 'all') {
      const merged = remote ? mergeAll('scores') : null
      return merged && merged.length ? merged : leagueScores['all']
    }
    return sliceArr(selectedLeague, 'scores') ?? leagueScores[selectedLeague] ?? leagueScores['all']
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, remote])

  const schedule = useMemo(() => {
    if (selectedLeague === 'all') {
      const merged = remote ? mergeAll('schedule') : null
      return merged && merged.length ? merged : leagueSchedule['all']
    }
    return sliceArr(selectedLeague, 'schedule') ?? leagueSchedule[selectedLeague] ?? leagueSchedule['all']
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, remote])

  const players = useMemo(() => {
    if (selectedLeague === 'all') {
      const merged = remote ? mergeAll('players') : null
      return merged && merged.length ? merged : footballPlayerDetails
    }
    const fromDb = sliceArr(selectedLeague, 'players')
    if (fromDb) return fromDb.length ? fromDb : footballPlayerDetails
    const filtered = footballPlayerDetails.filter((p) => p.league === selectedLeague)
    return filtered.length > 0 ? filtered : footballPlayerDetails
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, remote])

  const tournament = useMemo(() => {
    const r = remote?.[`${selectedLeague}::tournament`]
    if (Array.isArray(r) && r.length) return r as BracketRound[]
    // Before DB loads: show UCL default for Champions League only
    if (!remote && selectedLeague === 'Champions League') return DEFAULT_FOOTBALL_BRACKET as BracketRound[]
    return [] as BracketRound[]
  }, [selectedLeague, remote])

  const standingsTitle =
    selectedLeague === 'all' ? 'Premier League 2025/26' : `${selectedLeague} 2025/26`

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">⚽</span>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Football</h1>
          <p className="text-gray-500 text-sm">Premier League · UCL · La Liga · Serie A · Nations League</p>
        </div>
      </div>

      {/* League filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FOOTBALL_LEAGUES.filter((l) => l.id !== 'all').map((league) => {
          const active = selectedLeague === league.id
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
                active
                  ? 'bg-orange-400 text-white'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-400'
              )}
            >
              {league.logo ? (
                <img
                  src={league.logo}
                  alt={league.name}
                  className="h-4 w-4 object-contain shrink-0"
                />
              ) : (
                <span className="text-base leading-none">{league.emoji}</span>
              )}
              <span>{league.name}</span>
            </button>
          )
        })}
      </div>

      {/* Selected league highlight heading */}
      <div className=
        'flex items-center gap-4 rounded-2xl p-4 mb-6 transition-all'>
        {currentLeague.logo ? (
          <div className="h-16 w-16 shrink-0 flex items-center justify-center">
            <img
              src={currentLeague.logo}
              alt={currentLeague.name}
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </div>
        ) : (
          <div className="h-16 w-16 shrink-0 flex items-center justify-center text-5xl">
            {currentLeague.emoji}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider mb-0.5">
            {selectedLeague === 'all' ? 'All Competitions' : 'Competition'}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {selectedLeague === 'all' ? 'All Football' : currentLeague.name}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {selectedLeague === 'all'
              ? 'Premier League · Champions League · La Liga · Serie A · More'
              : '2025/26 Season'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="news">
        <TabsList className="mb-6">
          <TabsTrigger value="news" className='cursor-pointer'>News</TabsTrigger>
          <TabsTrigger value="scores" className='cursor-pointer'>Scores</TabsTrigger>
          <TabsTrigger value="standings" className='cursor-pointer'>Standings</TabsTrigger>
          <TabsTrigger value="players" className='cursor-pointer'>Players</TabsTrigger>
          <TabsTrigger value="schedule" className='cursor-pointer'>Schedule</TabsTrigger>
          <TabsTrigger value="tournament" className='cursor-pointer'>Tournament</TabsTrigger>
        </TabsList>

        {/* NEWS */}
        <TabsContent value="news">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-gray-400 text-sm">No articles found for {selectedLeague}.</p>
              <button
                onClick={() => setSelectedLeague('all')}
                className="mt-3 text-orange-500 text-sm font-medium hover:underline"
              >
                View all football news
              </button>
            </div>
          )}
        </TabsContent>

        {/* SCORES */}
        <TabsContent value="scores">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {scores.map((score) => {
              const homeWin = (score.homeScore ?? 0) > (score.awayScore ?? 0)
              const awayWin = (score.awayScore ?? 0) > (score.homeScore ?? 0)
              return (
                <Link
                  key={score.id}
                  href={`/sports/football/match/${score.id}`}
                  className="block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[65%]">
                      {score.competition}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        score.status === 'FT'
                          ? 'text-green-600 bg-green-50'
                          : 'text-orange-500 bg-orange-50'
                      )}
                    >
                      {score.status}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="px-4 pb-3 space-y-2">
                    {/* Home */}
                    <div className="flex items-center gap-3">
                      <TeamCrest name={score.homeTeam} />
                      <span className={cn('flex-1 text-sm truncate', homeWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>
                        {stripFlag(score.homeTeam)}
                      </span>
                      <span className={cn('text-xl font-black tabular-nums w-6 text-center', homeWin ? 'text-gray-900' : 'text-gray-400')}>
                        {score.homeScore}
                      </span>
                      <span className={cn('w-1 h-5 rounded-full', homeWin ? 'bg-orange-500' : 'bg-transparent')} />
                    </div>
                    {/* Away */}
                    <div className="flex items-center gap-3">
                      <TeamCrest name={score.awayTeam} />
                      <span className={cn('flex-1 text-sm truncate', awayWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>
                        {stripFlag(score.awayTeam)}
                      </span>
                      <span className={cn('text-xl font-black tabular-nums w-6 text-center', awayWin ? 'text-gray-900' : 'text-gray-400')}>
                        {score.awayScore}
                      </span>
                      <span className={cn('w-1 h-5 rounded-full', awayWin ? 'bg-orange-500' : 'bg-transparent')} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/60">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 min-w-0">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{score.venue}</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-orange-500 shrink-0 group-hover:gap-1.5 transition-all">
                      Details <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </TabsContent>

        {/* STANDINGS */}
        <TabsContent value="standings">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{standingsTitle}</h3>
              <div className="hidden sm:flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1 text-blue-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />UCL
                </span>
                <span className="flex items-center gap-1 text-orange-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-orange-400 inline-block" />Europa
                </span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />Conference
                </span>
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />Relegation
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-3 text-left w-8 text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">P</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">W</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">D</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">L</th>
                    <th className="px-3 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">GD</th>
                    <th className="px-3 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">Pts</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => (
                    <tr
                      key={row.pos}
                      className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn('inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold', ZONE_BADGE[row.zone])}>
                          {row.pos}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <TeamCrest name={row.team} size="sm" />
                          <span className="font-semibold text-gray-900 truncate">{stripFlag(row.team)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{row.played}</td>
                      <td className="px-3 py-2.5 text-center text-green-600 font-medium">{row.won}</td>
                      <td className="px-3 py-2.5 text-center text-gray-400">{row.drawn}</td>
                      <td className="px-3 py-2.5 text-center text-red-400 font-medium">{row.lost}</td>
                      <td
                        className={cn(
                          'px-3 py-2.5 text-center font-medium',
                          row.gd > 0 ? 'text-green-600' : row.gd < 0 ? 'text-red-500' : 'text-gray-400'
                        )}
                      >
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center justify-center min-w-7 px-1.5 py-0.5 rounded-md bg-gray-900 text-white text-xs font-black">
                          {row.points}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2.5">
                        <div className="flex items-center gap-0.5 justify-center">
                          {row.form.map((r, i) => (
                            <FormPill key={i} result={r} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* PLAYERS */}
        <TabsContent value="players">
          <PlayerProfile players={players} />
        </TabsContent>

        {/* SCHEDULE */}
        <TabsContent value="schedule">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {schedule.map((match) => {
              const rel = relativeLabel(match.date)
              return (
                <Link
                  key={match.id}
                  href={`/sports/football/match/${match.id}`}
                  className="block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[60%]">
                      {match.competition}
                    </span>
                    {rel ? (
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">{rel}</span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400">
                        {new Date(match.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="flex items-stretch justify-between gap-2 px-4 py-4">
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <TeamCrest name={match.homeTeam} size="lg" />
                      <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2 w-full">
                        {stripFlag(match.homeTeam)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center shrink-0 px-1">
                      <span className="text-[10px] font-black text-gray-300 tracking-widest">VS</span>
                      <span className="mt-1 text-sm font-bold text-gray-900 tabular-nums">{match.time}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <TeamCrest name={match.awayTeam} size="lg" />
                      <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2 w-full">
                        {stripFlag(match.awayTeam)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/60 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{match.venue}</span>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </TabsContent>

        {/* TOURNAMENT */}
        <TabsContent value="tournament">
          {tournament.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="text-4xl">🏆</span>
              <p className="text-sm font-semibold text-gray-600">
                No tournament bracket for {selectedLeague}
              </p>
              <p className="text-xs text-gray-400">
                No bracket set for {selectedLeague}. Upload it from the dashboard.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                {currentLeague.logo ? (
                  <img src={currentLeague.logo} alt={currentLeague.name} className="h-8 w-8 object-contain" />
                ) : (
                  <span className="text-2xl">{currentLeague.emoji}</span>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{currentLeague.name} Knockouts</h3>
                  <p className="text-gray-400 text-sm">2025/26 Season</p>
                </div>
              </div>
              <TournamentBracket rounds={tournament} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
