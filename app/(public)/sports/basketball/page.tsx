'use client'

import { useState, useMemo } from 'react'
import { Calendar, MapPin, X, Tv, Trophy } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ArticleCard from '@/components/blog/ArticleCard'
import TournamentBracket, { type BracketRound, type BracketMatch } from '@/components/sports/TournamentBracket'
import { cn } from '@/lib/utils'
import { mockPosts } from '@/lib/mock-data/posts'
import {
  team,
  nbaStandings,
  nbaScores,
  nbaSchedule,
  nbaPlayers,
  nbaPlayoffs,
  type NBAGame,
  type NBAPlayer,
  type GameResult,
  type BracketSeries,
  type Conference,
} from '@/lib/mock-data/basketball'

// ---- Team logo chip (abbreviation on brand gradient) ----
function TeamLogo({ abbr, size = 'md' }: { abbr: string; size?: 'sm' | 'md' | 'lg' }) {
  const t = team(abbr)
  const box = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-14 w-14 text-sm' : 'h-10 w-10 text-xs'
  return (
    <span
      className={cn('inline-flex items-center justify-center rounded-xl font-black text-white shrink-0 shadow-sm', box)}
      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color2})` }}
    >
      {abbr}
    </span>
  )
}

function ResultDot({ result }: { result: GameResult }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center h-4 w-4 rounded-full text-[8px] font-bold',
      result === 'W' ? 'bg-green-500 text-white' : 'bg-red-400 text-white',
    )}>{result}</span>
  )
}

// ---- Game card (shared by Scores + Schedule) ----
function relativeLabel(date: string): string | null {
  const diff = Math.round((new Date(date).getTime() - Date.now()) / 86400000)
  if (diff < 0 || diff > 60) return null
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return `In ${diff} days`
}

function GameCard({ game }: { game: NBAGame }) {
  const home = team(game.homeAbbr)
  const away = team(game.awayAbbr)
  const isFinal = game.status === 'Final'
  const homeWin = isFinal && (game.homeScore ?? 0) > (game.awayScore ?? 0)
  const awayWin = isFinal && (game.awayScore ?? 0) > (game.homeScore ?? 0)
  const rel = relativeLabel(game.date)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500">
          {game.national && (
            <span className="flex items-center gap-1 bg-gray-900 text-white px-1.5 py-0.5 rounded">
              <Tv className="h-2.5 w-2.5" />{game.national}
            </span>
          )}
        </span>
        {isFinal ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-600 bg-gray-100">FINAL</span>
        ) : game.status === 'Live' ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50 animate-pulse">● LIVE {game.quarter}</span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-orange-500 bg-orange-50">
            {rel ?? new Date(game.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        )}
      </div>

      {/* Away */}
      <div className="px-4 space-y-2 pb-2">
        <div className="flex items-center gap-3">
          <TeamLogo abbr={game.awayAbbr} />
          <div className="flex-1 min-w-0">
            <div className={cn('text-sm truncate', awayWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>{away.city}</div>
            <div className="text-[11px] text-gray-400">{away.name}</div>
          </div>
          {isFinal ? (
            <span className={cn('text-2xl font-black tabular-nums', awayWin ? 'text-gray-900' : 'text-gray-400')}>{game.awayScore}</span>
          ) : (
            <span className="text-[11px] font-bold text-gray-400">@</span>
          )}
        </div>
        {/* Home */}
        <div className="flex items-center gap-3">
          <TeamLogo abbr={game.homeAbbr} />
          <div className="flex-1 min-w-0">
            <div className={cn('text-sm truncate', homeWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>{home.city}</div>
            <div className="text-[11px] text-gray-400">{home.name}</div>
          </div>
          {isFinal ? (
            <span className={cn('text-2xl font-black tabular-nums', homeWin ? 'text-gray-900' : 'text-gray-400')}>{game.homeScore}</span>
          ) : (
            <span className="text-sm font-bold text-gray-900 tabular-nums">{game.time}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/60 text-[11px] text-gray-400">
        <span className="flex items-center gap-1 shrink-0">
          <Calendar className="h-3 w-3" />
          {new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-1 min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{game.arena}</span>
        </span>
      </div>
    </div>
  )
}

// ---- Player modal ----
function StatBar({ label, value, max, unit = '' }: { label: string; value: number; max: number; unit?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
      </div>
    </div>
  )
}

function PlayerModal({ player, onClose }: { player: NBAPlayer; onClose: () => void }) {
  const t = team(player.abbr)
  const initials = player.name.split(' ').map((n) => n[0]).join('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header in team colors */}
        <div className="p-5 text-white relative shrink-0" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color2})` }}>
          <button onClick={onClose} className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-white/20 border-2 border-white/30 shrink-0 flex items-center justify-center text-2xl font-black">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white/80 mb-0.5">#{player.jersey} · {player.position}</div>
              <h2 className="text-xl font-extrabold leading-tight">{player.name}</h2>
              <div className="text-sm text-white/80 mt-0.5">{t.city} {t.name}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-base">{player.flag}</span>
                <span className="text-xs text-white/80">{player.country} · {player.height} · {player.age} yrs</span>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-12 bg-white/20 rounded-xl px-2.5 py-1.5 text-center border border-white/20">
            <div className="text-[10px] text-white/80 font-medium">Rating</div>
            <div className="text-xl font-black leading-none mt-0.5">{player.rating}</div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Per Game</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'PPG', value: player.ppg },
                { label: 'RPG', value: player.rpg },
                { label: 'APG', value: player.apg },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl bg-orange-50 border border-orange-100 p-3">
                  <div className="text-2xl font-black text-orange-500">{s.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'STL', value: player.spg },
              { label: 'BLK', value: player.bpg },
              { label: 'MIN', value: player.minutes },
            ].map((s) => (
              <div key={s.label} className="text-center rounded-xl bg-gray-50 border border-gray-100 p-2.5">
                <div className="text-lg font-black text-gray-800">{s.value}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Shooting Splits</h3>
            <div className="space-y-3">
              <StatBar label="Field Goal %" value={player.fgPct} max={65} unit="%" />
              <StatBar label="3-Point %"    value={player.threePct} max={50} unit="%" />
              <StatBar label="Free Throw %" value={player.ftPct} max={100} unit="%" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3">
            <span className="text-lg">🏀</span>
            <div>
              <div className="text-sm font-bold text-gray-900">{player.games} games</div>
              <div className="text-[10px] text-gray-400">Played this season</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-gray-900">{player.minutes} min</div>
              <div className="text-[10px] text-gray-400">Avg. minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Bracket series cell ----
function SeriesCell({ series }: { series: BracketSeries }) {
  const hi = team(series.high.abbr)
  const lo = team(series.low.abbr)
  const hiWin = series.done && series.high.wins > series.low.wins
  const loWin = series.done && series.low.wins > series.high.wins
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden w-full">
      <div className={cn('flex items-center gap-2 px-2.5 py-2', hiWin && 'bg-green-50')}>
        <span className="text-[9px] font-bold text-gray-300 w-3 text-center">{series.high.seed}</span>
        <TeamLogo abbr={series.high.abbr} size="sm" />
        <span className={cn('flex-1 text-xs truncate', hiWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>{hi.name}</span>
        <span className={cn('text-sm font-black tabular-nums w-5 text-center', hiWin ? 'text-green-600' : 'text-gray-400')}>{series.high.wins}</span>
      </div>
      <div className="h-px bg-gray-100" />
      <div className={cn('flex items-center gap-2 px-2.5 py-2', loWin && 'bg-green-50')}>
        <span className="text-[9px] font-bold text-gray-300 w-3 text-center">{series.low.seed}</span>
        <TeamLogo abbr={series.low.abbr} size="sm" />
        <span className={cn('flex-1 text-xs truncate', loWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>{lo.name}</span>
        <span className={cn('text-sm font-black tabular-nums w-5 text-center', loWin ? 'text-green-600' : 'text-gray-400')}>{series.low.wins}</span>
      </div>
    </div>
  )
}

// ---- convert a best-of-7 series into a bracket match ----
function seriesToMatch(s: BracketSeries): BracketMatch {
  const hiWin = s.done && s.high.wins > s.low.wins
  const loWin = s.done && s.low.wins > s.high.wins
  return {
    date: `#${s.high.seed} vs #${s.low.seed}`,
    home: s.high.abbr,
    away: s.low.abbr,
    homeScore: s.high.wins,
    awayScore: s.low.wins,
    winner: hiWin ? 'home' : loWin ? 'away' : null,
  }
}

function confRounds(conf: { first: BracketSeries[]; semis: BracketSeries[]; finals: BracketSeries[] }): BracketRound[] {
  return [
    { title: 'First Round',  matches: conf.first.map(seriesToMatch) },
    { title: 'Conf. Semis',  matches: conf.semis.map(seriesToMatch) },
    { title: 'Conf. Finals', matches: conf.finals.map(seriesToMatch) },
  ]
}

// bracket crest/label renderers (NBA brand-colored logo + team name)
const renderNbaCrest = (abbr: string) => <TeamLogo abbr={abbr} size="sm" />
const renderNbaLabel = (abbr: string) => team(abbr).name

// ---- Standings table ----
function StandingsTable({ conf, rows }: { conf: Conference; rows: typeof nbaStandings }) {
  return (
    <div>
      <h3 className="font-bold text-gray-900 text-lg mb-3">
        {conf === 'East' ? 'Eastern' : 'Western'} Conference
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-3 py-3 text-left w-8 text-xs font-semibold text-gray-400 uppercase">#</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
              <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">W</th>
              <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">L</th>
              <th className="px-3 py-3 text-center w-14 text-xs font-semibold text-gray-400 uppercase">PCT</th>
              <th className="px-3 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">GB</th>
              <th className="px-3 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">Strk</th>
              <th className="hidden sm:table-cell px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Last 10</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const t = team(row.abbr)
              const playoff = row.pos <= 6
              const playin = row.pos >= 7 && row.pos <= 10
              return (
                <tr key={row.abbr} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40 transition-colors">
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn(
                      'inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold',
                      playoff ? 'bg-green-500 text-white' : playin ? 'bg-blue-400 text-white' : 'bg-gray-100 text-gray-500'
                    )}>{row.pos}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo abbr={row.abbr} size="sm" />
                      <div className="min-w-0">
                        <span className="font-semibold text-gray-900 block leading-tight truncate">{t.city}</span>
                        <span className="text-[10px] text-gray-400">{t.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center text-green-600 font-bold">{row.won}</td>
                  <td className="px-3 py-2.5 text-center text-red-400 font-medium">{row.lost}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600 font-medium tabular-nums">{row.pct}</td>
                  <td className="px-3 py-2.5 text-center text-gray-400 tabular-nums">{row.gb}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn('text-xs font-bold', row.streak.startsWith('W') ? 'text-green-600' : 'text-red-400')}>{row.streak}</span>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2.5">
                    <div className="flex items-center gap-0.5 justify-center">
                      {row.last10.map((r, i) => <ResultDot key={i} result={r} />)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---- Main page ----
export default function BasketballPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<NBAPlayer | null>(null)

  const posts = useMemo(
    () => mockPosts.filter((p) => p.sport === 'Basketball' && p.status === 'published'),
    []
  )
  const east = useMemo(() => nbaStandings.filter((r) => r.conf === 'East'), [])
  const west = useMemo(() => nbaStandings.filter((r) => r.conf === 'West'), [])

  const champ = nbaPlayoffs.finals
  const finalsLeader = champ.high.wins >= champ.low.wins ? champ.high : champ.low

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 shrink-0 flex items-center justify-center">
          <img src="/nba.png" alt="NBA" className="h-full w-full object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Basketball</h1>
          <p className="text-gray-500 text-sm mt-0.5">NBA 2025/26 · Regular Season · Playoffs</p>
        </div>
      </div>

      {/* Finals banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 px-5 py-3.5 mb-6 text-white">
        <Trophy className="h-6 w-6 text-yellow-400 shrink-0" />
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NBA Finals · Game {champ.high.wins + champ.low.wins + 1}</div>
          <div className="font-extrabold text-white text-lg leading-tight truncate">
            {team(champ.high.abbr).name} vs {team(champ.low.abbr).name}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <TeamLogo abbr={champ.high.abbr} size="sm" />
          <span className="text-xl font-black tabular-nums">{champ.high.wins}–{champ.low.wins}</span>
          <TeamLogo abbr={champ.low.abbr} size="sm" />
        </div>
      </div>

      <Tabs defaultValue="news">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="news"       className="cursor-pointer">News</TabsTrigger>
          <TabsTrigger value="scores"     className="cursor-pointer">Scores</TabsTrigger>
          <TabsTrigger value="schedule"   className="cursor-pointer">Schedule</TabsTrigger>
          <TabsTrigger value="players"    className="cursor-pointer">Players</TabsTrigger>
          <TabsTrigger value="standings"  className="cursor-pointer">Standings</TabsTrigger>
          <TabsTrigger value="tournament" className="cursor-pointer">Tournament</TabsTrigger>
        </TabsList>

        {/* NEWS */}
        <TabsContent value="news">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => <ArticleCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-gray-400 text-sm">No basketball articles published yet.</p>
            </div>
          )}
        </TabsContent>

        {/* SCORES */}
        <TabsContent value="scores">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {nbaScores.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </TabsContent>

        {/* SCHEDULE */}
        <TabsContent value="schedule">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {nbaSchedule.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </TabsContent>

        {/* PLAYERS */}
        <TabsContent value="players">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {nbaPlayers.map((player) => {
              const t = team(player.abbr)
              const initials = player.name.split(' ').map((n) => n[0]).join('')
              return (
                <button
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all text-left w-full group cursor-pointer"
                >
                  <div className="relative h-20 flex items-end" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color2})` }}>
                    <div className="absolute top-2 right-2.5 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 border border-white/20">
                      <span className="text-[9px] font-medium text-white/90">RTG</span>
                      <span className="text-sm font-black text-white leading-none">{player.rating}</span>
                    </div>
                    <span className="absolute top-2 left-3 text-xs font-black text-white/80">#{player.jersey}</span>
                    <div className="absolute -bottom-7 left-4 h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-[3px] border-white shadow-sm flex items-center justify-center font-black text-gray-700 text-base">
                      {initials}
                    </div>
                  </div>

                  <div className="pt-9 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-500 transition-colors truncate">{player.name}</span>
                      <span className="text-sm leading-none shrink-0" title={player.country}>{player.flag}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{player.position}</Badge>
                      <span className="text-xs text-gray-500 truncate">{t.city} {t.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 px-4">
                    {[
                      { label: 'PPG', value: player.ppg },
                      { label: 'RPG', value: player.rpg },
                      { label: 'APG', value: player.apg },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
                        <div className="text-lg font-bold text-orange-500">{stat.value}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 mb-3 text-center">
                    <span className="text-[10px] text-orange-400 font-medium group-hover:text-orange-500 transition-colors">View full stats →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>

        {/* STANDINGS */}
        <TabsContent value="standings">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px]">
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />Playoff berth
            </span>
            <span className="flex items-center gap-1 text-blue-500 font-semibold">
              <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />Play-In (7–10)
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <StandingsTable conf="East" rows={east} />
            <StandingsTable conf="West" rows={west} />
          </div>
        </TabsContent>

        {/* TOURNAMENT */}
        <TabsContent value="tournament">
          <h3 className="font-bold text-gray-900 text-lg mb-1">2026 NBA Playoffs</h3>
          <p className="text-gray-400 text-sm mb-6">Best-of-7 series · Road to the championship</p>

          {/* Western Conference */}
          <div className="mb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-4 w-1.5 rounded-full bg-red-500" />
              <h4 className="font-bold text-gray-800">Western Conference</h4>
            </div>
            <TournamentBracket rounds={confRounds(nbaPlayoffs.west)} renderCrest={renderNbaCrest} renderLabel={renderNbaLabel} />
          </div>

          {/* NBA Finals (center) */}
          <div className="my-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h4 className="font-extrabold text-gray-900 text-lg">NBA Finals</h4>
            </div>
            <div className="w-full max-w-xs rounded-2xl border-2 border-yellow-300 bg-linear-to-br from-yellow-50 to-orange-50 p-1 shadow-md">
              <SeriesCell series={nbaPlayoffs.finals} />
            </div>
            {!nbaPlayoffs.finals.done && (
              <p className="mt-3 text-xs text-gray-500">
                <span className="font-bold text-gray-900">{team(finalsLeader.abbr).city} {team(finalsLeader.abbr).name}</span> lead the series
              </p>
            )}
          </div>

          {/* Eastern Conference */}
          <div className="mt-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-4 w-1.5 rounded-full bg-blue-500" />
              <h4 className="font-bold text-gray-800">Eastern Conference</h4>
            </div>
            <TournamentBracket rounds={confRounds(nbaPlayoffs.east)} renderCrest={renderNbaCrest} renderLabel={renderNbaLabel} />
          </div>
        </TabsContent>
      </Tabs>

      {selectedPlayer && <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  )
}
