'use client'

import { useState, useMemo } from 'react'
import { Calendar, MapPin, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import TournamentBracket, { type BracketRound } from '@/components/sports/TournamentBracket'
import { cn } from '@/lib/utils'
import {
  CRICKET_LEAGUES,
  cricketStandings,
  cricketScores,
  cricketSchedule,
  cricketPlayerDetails,
  type FormResult,
  type CricketZoneType,
  type CricketPlayerDetail,
} from '@/lib/mock-data/cricket'

// ICC T20 World Cup 2026 knockout bracket
const T20_BRACKET: BracketRound[] = [
  {
    title: 'Quarter-finals',
    matches: [
      { date: '24 Jun', home: '🇮🇳 India',        away: '🇦🇺 Australia',    homeScore: '186/4', awayScore: '171/9', winner: 'home' },
      { date: '25 Jun', home: '🇬🇧 England',      away: 'West Indies',      homeScore: '192/6', awayScore: '188/7', winner: 'home' },
      { date: '26 Jun', home: '🇿🇦 South Africa', away: '🇳🇿 New Zealand',  homeScore: '165/5', awayScore: '160/8', winner: 'home' },
      { date: '27 Jun', home: '🇵🇰 Pakistan',     away: '🇦🇫 Afghanistan',  homeScore: '178/3', awayScore: '154/9', winner: 'home' },
    ],
  },
  {
    title: 'Semi-finals',
    matches: [
      { date: '01 Jul', home: '🇮🇳 India',        away: '🇬🇧 England',   homeScore: '195/5', awayScore: '173/8', winner: 'home' },
      { date: '02 Jul', home: '🇿🇦 South Africa', away: '🇵🇰 Pakistan',  homeScore: '169/6', awayScore: '162/8', winner: 'home' },
    ],
  },
  {
    title: 'Final',
    matches: [
      { date: '05 Jul · Bridgetown', home: '🇮🇳 India', away: '🇿🇦 South Africa', homeScore: '176/7', awayScore: '169/8', winner: 'home' },
    ],
  },
]

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

const ZONE_BADGE: Record<CricketZoneType, string> = {
  qualifier: 'bg-blue-500 text-white',
  eliminated: 'bg-red-400 text-white',
  '': 'bg-gray-100 text-gray-500',
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

function TeamCrest({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'
  const flag = leadingFlag(name)
  if (flag) {
    return (
      <span className={cn(
        'inline-flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 shrink-0',
        box,
        size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg',
      )}>
        {flag}
      </span>
    )
  }
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

function PlayerAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('')
  return (
    <div className={cn('bg-orange-100 flex items-center justify-center font-bold text-orange-600', className)}>
      {initials}
    </div>
  )
}

function StatBar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400 rounded-full transition-all"
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

function CricketPlayerModal({ player, onClose }: { player: CricketPlayerDetail; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-linear-to-br from-orange-500 to-orange-600 p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-orange-400/50 border-2 border-white/30 shrink-0">
              <PlayerAvatar name={player.name} className="h-full w-full text-2xl" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-orange-100 mb-0.5">#{player.jersey}</div>
              <h2 className="text-xl font-extrabold leading-tight">{player.name}</h2>
              <div className="text-sm text-orange-100 mt-0.5">{player.team}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded-full font-medium">{player.role}</span>
                <span className="text-base">{player.flag}</span>
                <span className="text-xs text-orange-100">{player.nationality}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-12 bg-white/20 rounded-xl px-2.5 py-1.5 text-center border border-white/20">
            <div className="text-[10px] text-orange-100 font-medium">Rating</div>
            <div className="text-xl font-black leading-none mt-0.5">{player.rating}</div>
          </div>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Season Stats</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Matches', value: player.matches },
                { label: 'Runs',    value: player.runs },
                { label: 'Wkts',    value: player.wickets },
                { label: 'Age',     value: player.age },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl bg-orange-50 border border-orange-100 p-2.5">
                  <div className="text-lg font-black text-orange-500">{s.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3">
            <span className="text-lg">🏏</span>
            <div>
              <div className="text-sm font-bold text-gray-900">Avg {player.average.toFixed(1)}</div>
              <div className="text-[10px] text-gray-400">Batting Average</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-gray-900">SR {player.strikeRate.toFixed(1)}</div>
              <div className="text-[10px] text-gray-400">Strike Rate</div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Performance</h3>
            <div className="space-y-3">
              <StatBar label="Strike Rate" value={player.strikeRate} max={200} unit="" />
              <StatBar label="Batting Avg" value={player.average}    max={80}  unit="" />
              {player.wickets > 0 && <StatBar label="Economy Rate" value={player.economy}    max={12} unit="" />}
              {player.wickets > 0 && <StatBar label="Bowling Avg"  value={player.bowlingAvg} max={50} unit="" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Batting</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{player.fifties}</div>
                  <div className="text-[9px] text-gray-400">Fifties</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{player.hundreds}</div>
                  <div className="text-[9px] text-gray-400">Hundreds</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Fielding</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{player.catches}</div>
                  <div className="text-[9px] text-gray-400">Catches</div>
                </div>
                {player.wickets > 0 && (
                  <div className="text-center">
                    <div className="text-base font-bold text-gray-700">{player.fiveWickets}</div>
                    <div className="text-[9px] text-gray-400">5-Wkts</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CricketPlayers({ players }: { players: CricketPlayerDetail[] }) {
  const [selected, setSelected] = useState<CricketPlayerDetail | null>(null)
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelected(player)}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all text-left w-full group cursor-pointer"
          >
            <div className="relative h-20 bg-linear-to-br from-orange-400 to-orange-600">
              <div className="absolute top-2 right-2.5 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 border border-white/20">
                <span className="text-[9px] font-medium text-orange-50">RTG</span>
                <span className="text-sm font-black text-white leading-none">{player.rating}</span>
              </div>
              <span className="absolute top-2 left-3 text-xs font-black text-white/80">#{player.jersey}</span>
              <div className="absolute -bottom-7 left-4 h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-[3px] border-white shadow-sm">
                <PlayerAvatar name={player.name} className="h-full w-full text-base" />
              </div>
            </div>

            <div className="pt-9 px-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-500 transition-colors truncate">{player.name}</span>
                <span className="text-sm leading-none shrink-0" title={player.nationality}>{player.flag}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{player.role}</Badge>
                <span className="text-xs text-gray-500 truncate">{player.team}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 px-4">
              {[
                { label: 'Runs', value: player.runs },
                { label: 'Wkts', value: player.wickets },
                { label: 'Avg',  value: player.average.toFixed(1) },
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
        ))}
      </div>
      {selected && <CricketPlayerModal player={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

export default function CricketPage() {
  const [selectedLeague, setSelectedLeague] = useState('all')

  const currentLeague = useMemo(
    () => CRICKET_LEAGUES.find((l) => l.id === selectedLeague) ?? CRICKET_LEAGUES[0],
    [selectedLeague]
  )

  const standings = useMemo(() => {
    const key = selectedLeague === 'all' ? 'IPL' : selectedLeague
    return cricketStandings[key] ?? cricketStandings['IPL']
  }, [selectedLeague])

  const scores   = useMemo(() => cricketScores[selectedLeague]   ?? cricketScores['all'],   [selectedLeague])
  const schedule = useMemo(() => cricketSchedule[selectedLeague] ?? cricketSchedule['all'], [selectedLeague])

  const players = useMemo(() => {
    if (selectedLeague === 'all') return cricketPlayerDetails
    const filtered = cricketPlayerDetails.filter((p) => p.league === selectedLeague)
    return filtered.length > 0 ? filtered : cricketPlayerDetails
  }, [selectedLeague])

  const standingsTitle = selectedLeague === 'all' ? 'IPL 2025' : `${selectedLeague} 2025`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🏏</span>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Cricket</h1>
          <p className="text-gray-500 text-sm">ICC T20 · IPL · PSL · BBL · International</p>
        </div>
      </div>

      {/* League filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CRICKET_LEAGUES.map((league) => {
          const active = selectedLeague === league.id
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border',
                active
                  ? 'bg-orange-400 text-white border-orange-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-400'
              )}
            >
              {league.logo ? (
                <img src={league.logo} alt={league.name} className="h-4 w-4 object-contain shrink-0" />
              ) : (
                <span className="text-base leading-none">{league.emoji}</span>
              )}
              <span>{league.name}</span>
            </button>
          )
        })}
      </div>

      {/* League highlight heading */}
      <div className="flex items-center gap-4 rounded-2xl p-4 mb-6 transition-all">
        {currentLeague.logo ? (
          <div className="h-16 w-16 shrink-0 flex items-center justify-center">
            <img src={currentLeague.logo} alt={currentLeague.name} className="h-full w-full object-contain drop-shadow-sm" />
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
            {selectedLeague === 'all' ? 'All Cricket' : currentLeague.name}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {selectedLeague === 'all' ? 'ICC T20 · IPL · PSL · BBL · More' : '2025/26 Season'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="scores">
        <TabsList className="mb-6">
          <TabsTrigger value="scores"    className="cursor-pointer">Scores</TabsTrigger>
          <TabsTrigger value="standings" className="cursor-pointer">Standings</TabsTrigger>
          <TabsTrigger value="players"   className="cursor-pointer">Players</TabsTrigger>
          <TabsTrigger value="schedule"  className="cursor-pointer">Schedule</TabsTrigger>
          <TabsTrigger value="tournament" className="cursor-pointer">Tournament</TabsTrigger>
        </TabsList>

        {/* SCORES */}
        <TabsContent value="scores">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {scores.map((score) => {
              const homeWin = score.winner === 'home'
              const awayWin = score.winner === 'away'
              return (
                <div
                  key={score.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[65%]">
                      {score.competition}
                    </span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      score.status === 'FT' ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50'
                    )}>
                      {score.status}
                    </span>
                  </div>

                  <div className="px-4 pb-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <TeamCrest name={score.homeTeam} />
                      <span className={cn('flex-1 text-sm truncate', homeWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>
                        {stripFlag(score.homeTeam)}
                      </span>
                      <span className={cn('text-base font-black tabular-nums', homeWin ? 'text-gray-900' : 'text-gray-400')}>
                        {score.homeScore}
                      </span>
                      <span className={cn('w-1 h-5 rounded-full shrink-0', homeWin ? 'bg-orange-500' : 'bg-transparent')} />
                    </div>
                    <div className="flex items-center gap-3">
                      <TeamCrest name={score.awayTeam} />
                      <span className={cn('flex-1 text-sm truncate', awayWin ? 'font-bold text-gray-900' : 'font-medium text-gray-600')}>
                        {stripFlag(score.awayTeam)}
                      </span>
                      <span className={cn('text-base font-black tabular-nums', awayWin ? 'text-gray-900' : 'text-gray-400')}>
                        {score.awayScore}
                      </span>
                      <span className={cn('w-1 h-5 rounded-full shrink-0', awayWin ? 'bg-orange-500' : 'bg-transparent')} />
                    </div>
                  </div>

                  {score.result && (
                    <div className="px-4 pb-2">
                      <p className="text-[11px] text-orange-500 font-medium truncate">{score.result}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1 px-4 py-2 border-t border-gray-50 bg-gray-50/60">
                    <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                    <span className="text-[11px] text-gray-400 truncate">{score.venue}</span>
                  </div>
                </div>
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
                  <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />Qualifier
                </span>
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-400 inline-block" />Eliminated
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-3 text-left w-8 text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">M</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">W</th>
                    <th className="px-3 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">L</th>
                    <th className="px-3 py-3 text-center w-16 text-xs font-semibold text-gray-400 uppercase">NRR</th>
                    <th className="px-3 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">Pts</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Form</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row) => (
                    <tr key={row.pos} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40 transition-colors">
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
                      <td className="px-3 py-2.5 text-center text-red-400 font-medium">{row.lost}</td>
                      <td className={cn(
                        'px-3 py-2.5 text-center text-xs font-medium',
                        row.nrr.startsWith('+') ? 'text-green-600' : row.nrr.startsWith('-') ? 'text-red-500' : 'text-gray-400'
                      )}>
                        {row.nrr}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center justify-center min-w-7 px-1.5 py-0.5 rounded-md bg-gray-900 text-white text-xs font-black">
                          {row.points}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2.5">
                        <div className="flex items-center gap-0.5 justify-center">
                          {row.form.map((r, i) => <FormPill key={i} result={r} />)}
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
          <CricketPlayers players={players} />
        </TabsContent>

        {/* SCHEDULE */}
        <TabsContent value="schedule">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {schedule.map((match) => {
              const rel = relativeLabel(match.date)
              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-orange-200 transition-all"
                >
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
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* TOURNAMENT */}
        <TabsContent value="tournament">
          <div className="flex items-center gap-3 mb-5">
            <img src="/icc.png" alt="ICC T20 World Cup" className="h-9 w-9 object-contain" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">ICC T20 World Cup Knockouts</h3>
              <p className="text-gray-400 text-sm">2026 · Quarter-finals to the Final</p>
            </div>
          </div>
          <TournamentBracket rounds={T20_BRACKET} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
