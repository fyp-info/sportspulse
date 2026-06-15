'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Trophy, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import DataEditor, { type Column } from './DataEditor'
import TournamentEditor, { emptyBracket } from './TournamentEditor'
import Toast from '@/components/dashboard/Toast'
import type { BracketRound } from '@/components/sports/TournamentBracket'
import { footballStandings, cricketStandings, type MatchInput } from '@/lib/sports-calc'
import { SPORT_TABS, SPORT_LEAGUE_KEYS } from '@/lib/sports-data'

export type SportKey = 'football' | 'cricket' | 'formula-1'

const uid = () => Math.random().toString(36).slice(2, 9)
type Row = Record<string, unknown> & { id: string }

// --------------------------------------------------------------- metadata ----
interface League { id: string; name: string; logo: string | null; emoji: string }

const LEAGUE_META: Record<SportKey, League[]> = {
  football: [
    { id: 'Premier League',   name: 'Premier League',   logo: '/Premier League logo.png', emoji: '🏴' },
    { id: 'Champions League', name: 'Champions League', logo: '/ucl logo.png',            emoji: '⭐' },
    { id: 'La Liga',          name: 'La Liga',          logo: '/la liga logo.png',        emoji: '🇪🇸' },
    { id: 'Serie A',          name: 'Serie A',          logo: '/serie a logo.png',        emoji: '🇮🇹' },
    { id: 'Nations League',   name: 'Nations League',   logo: '/Nations League logo.png', emoji: '🏅' },
    { id: 'FIFA World Cup',   name: 'FIFA World Cup',   logo: '/fifa logo.png',           emoji: '🌍' },
  ],
  cricket: [
    { id: 'ICC T20', name: 'ICC T20', logo: '/icc.png', emoji: '🌍' },
    { id: 'IPL',     name: 'IPL',     logo: '/ipl.png', emoji: '🇮🇳' },
    { id: 'PSL',     name: 'PSL',     logo: '/psl.png', emoji: '🇵🇰' },
    { id: 'BBL',     name: 'BBL',     logo: '/bbl.png', emoji: '🇦🇺' },
  ],
  'formula-1': [
    { id: '2026', name: '2026 Season', logo: '/f1.png', emoji: '🏎️' },
    { id: '2025', name: '2025 Season', logo: '/f1.png', emoji: '🏎️' },
    { id: '2024', name: '2024 Season', logo: '/f1.png', emoji: '🏎️' },
  ],
}

const META: Record<SportKey, { name: string; emoji: string; color: string; desc: string; leagueLabel: string }> = {
  football:    { name: 'Football',  emoji: '⚽', color: 'from-emerald-500 to-green-600', desc: 'Manage matches, tables, players, fixtures & knockouts', leagueLabel: 'Select League' },
  cricket:     { name: 'Cricket',   emoji: '🏏', color: 'from-sky-500 to-blue-600',     desc: 'Manage matches, standings, players, fixtures & knockouts', leagueLabel: 'Select League' },
  'formula-1': { name: 'Formula 1', emoji: '🏎️', color: 'from-red-500 to-rose-600',     desc: 'Manage race results, driver & constructor standings', leagueLabel: 'Select Season' },
}

const TAB_LABEL: Record<string, string> = {
  scores: 'Scores', standings: 'Standings', players: 'Players', schedule: 'Schedule',
  tournament: 'Tournament', races: 'Races', drivers: 'Drivers', teams: 'Teams',
}

// -------------------------------------------------------------- form utils ----
const csvToForm = (s: unknown): string[] =>
  String(s ?? '').split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter((x) => x === 'W' || x === 'D' || x === 'L')
const formToCsv = (f: unknown): string => (Array.isArray(f) ? f.join(',') : '')
const numScore = (v: unknown): number => Number(String(v ?? '').split('/')[0]) || 0

// Augment stored rows with an editor `id` (+ formStr for standings).
function withIds(tab: string, arr: unknown): Row[] {
  if (!Array.isArray(arr)) return []
  return arr.map((r) => {
    const row = { ...(r as Record<string, unknown>) }
    if (tab === 'standings') row.formStr = formToCsv(row.form)
    return { ...row, id: row.id != null ? String(row.id) : uid() } as Row
  })
}

// Convert editor rows back to the public stored shape for a tab.
function normalize(tab: string, league: string, rows: Row[]): unknown[] {
  if (tab === 'standings') {
    return rows.map((r, i) => {
      const { formStr, ...rest } = r
      return { ...rest, pos: i + 1, form: csvToForm(formStr) }
    })
  }
  if (tab === 'drivers' || tab === 'teams') {
    return rows.map((r, i) => ({ ...r, pos: i + 1 }))
  }
  if (tab === 'scores') {
    return rows.map((r) => ({ league, ...r }))
  }
  if (tab === 'schedule') {
    return rows.map((r) => ({ league, ...r }))
  }
  return rows
}

// ============================================================== component ====
export default function SportsManager({ sport }: { sport: SportKey }) {
  const meta = META[sport]
  const leagues = LEAGUE_META[sport]
  const tabs = SPORT_TABS[sport]

  const [league, setLeague] = useState(leagues[0].id)
  const [store, setStore] = useState<Record<string, Row[]>>({})
  const [brackets, setBrackets] = useState<Record<string, BracketRound[]>>({})
  const [dirty, setDirty] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  // Hydrate every league/tab slice from the database (mock fallback baked in by the API).
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/sports/${sport}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return
        const data: Record<string, unknown> = res.data ?? {}
        const nextStore: Record<string, Row[]> = {}
        const nextBrackets: Record<string, BracketRound[]> = {}
        for (const lg of SPORT_LEAGUE_KEYS[sport]) {
          for (const tab of tabs) {
            const k = `${lg}::${tab}`
            if (tab === 'tournament') {
              const rounds = data[k]
              nextBrackets[lg] = Array.isArray(rounds) && rounds.length ? (rounds as BracketRound[]) : emptyBracket()
            } else {
              nextStore[k] = withIds(tab, data[k])
            }
          }
        }
        setStore(nextStore)
        setBrackets(nextBrackets)
      })
      .catch(() => { if (!cancelled) setError('Could not load saved data.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [sport, tabs])

  const k = (tab: string) => `${league}::${tab}`
  const rowsOf = (tab: string): Row[] => store[k(tab)] ?? []
  const markDirty = useCallback((key: string) => setDirty((d) => new Set(d).add(key)), [])

  const setRows = (tab: string, rows: Row[]) => {
    setStore((s) => ({ ...s, [k(tab)]: rows }))
    markDirty(k(tab))
  }
  const setBracket = (rounds: BracketRound[]) => {
    setBrackets((b) => ({ ...b, [league]: rounds }))
    markDirty(`${league}::tournament`)
  }

  // Recalculate standings numeric columns from the Scores tab (keeps form/zone/nrr).
  const recalcStandings = () => {
    const scores = rowsOf('scores')
    const matches: MatchInput[] = scores.map((s) => ({
      id: s.id, home: String(s.homeTeam ?? ''), away: String(s.awayTeam ?? ''),
      homeScore: numScore(s.homeScore), awayScore: numScore(s.awayScore),
    }))
    const existing = rowsOf('standings')
    const byTeam = new Map(existing.map((r) => [String(r.team), r]))
    if (sport === 'football') {
      const computed = footballStandings(matches)
      const rows: Row[] = computed.map((c) => {
        const prev = byTeam.get(c.team)
        return { id: prev?.id ?? uid(), team: c.team, played: c.p, won: c.w, drawn: c.d, lost: c.l, gd: c.gd, points: c.pts,
          formStr: prev?.formStr ?? '', zone: prev?.zone ?? '' }
      })
      setRows('standings', rows)
    } else {
      const computed = cricketStandings(matches)
      const rows: Row[] = computed.map((c) => {
        const prev = byTeam.get(c.team)
        return { id: prev?.id ?? uid(), team: c.team, played: c.p, won: c.w, lost: c.l,
          nrr: prev?.nrr ?? '0.00', points: c.pts, formStr: prev?.formStr ?? '', zone: prev?.zone ?? '' }
      })
      setRows('standings', rows)
    }
    setToast('Standings recalculated from scores. Review form/zone, then Save.')
  }

  // Persist only the slices that changed — one PATCH per (league, tab).
  const save = async () => {
    setError('')
    setSaving(true)
    try {
      const keys = [...dirty]
      // Always allow saving the current view even if untouched flags missed it.
      for (const key of keys) {
        const [lg, tab] = key.split('::')
        const data = tab === 'tournament'
          ? (brackets[lg] ?? [])
          : normalize(tab, lg, store[key] ?? [])
        const res = await fetch(`/api/sports/${sport}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-auth-realm': 'staff' },
          body: JSON.stringify({ league: lg, tab, data }),
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error ?? 'Save failed')
        }
      }
      setDirty(new Set())
      setToast(keys.length ? `Saved — changes are now live on the website.` : 'Nothing to save.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href=".." className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className={`h-12 w-12 rounded-2xl bg-linear-to-br ${meta.color} flex items-center justify-center text-2xl shadow-sm`}>
            {meta.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meta.name}</h1>
            <p className="text-gray-500 text-sm">{meta.desc}</p>
          </div>
        </div>
        <Button variant="primary" onClick={save} disabled={saving || loading}>
          <Save className="h-4 w-4" /> {saving ? 'Saving…' : dirty.size ? `Save (${dirty.size})` : 'Save Data'}
        </Button>
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">{error}</div>}

      {/* League selector */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{meta.leagueLabel}</p>
        <div className="flex flex-wrap gap-2">
          {leagues.map((lg) => {
            const active = league === lg.id
            return (
              <button
                key={lg.id}
                onClick={() => setLeague(lg.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="h-6 w-6 rounded-md bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {lg.logo ? <img src={lg.logo} alt="" className="h-full w-full object-contain" /> : <span className="text-sm">{lg.emoji}</span>}
                </span>
                {lg.name}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Editing <span className="font-medium text-orange-600">{league}</span> — each {sport === 'formula-1' ? 'season' : 'league'} & tab keeps its own data.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center text-sm text-gray-400">Loading saved data…</div>
      ) : (
        <Tabs defaultValue={tabs[0]} key={league}>
          <TabsList className="flex-wrap">
            {tabs.map((t) => <TabsTrigger key={t} value={t}>{TAB_LABEL[t]}</TabsTrigger>)}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-5">
              {tab === 'tournament' ? (
                <Card title="Tournament Bracket" hint="Edit the knockout rounds; the preview matches the public tournament page.">
                  <TournamentEditor rounds={brackets[league] ?? emptyBracket()} onChange={setBracket} />
                </Card>
              ) : (
                <Card
                  title={CARD_TITLE[tab] ?? TAB_LABEL[tab]}
                  hint={CARD_HINT[tab]}
                  action={tab === 'standings' ? (
                    <Button variant="outline" size="sm" onClick={recalcStandings}>
                      <RefreshCw className="h-3.5 w-3.5" /> Recalculate from Scores
                    </Button>
                  ) : undefined}
                >
                  <DataEditor
                    columns={columnsFor(sport, tab)}
                    rows={rowsOf(tab)}
                    onChange={(rows) => setRows(tab, rows as Row[])}
                    makeRow={() => makeRow(sport, tab, league)}
                    addLabel={ADD_LABEL[tab] ?? 'Add Row'}
                  />
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

// ------------------------------------------------------------- card copy -----
const CARD_TITLE: Record<string, string> = {
  scores: 'Match Results', standings: 'League Standings', players: 'Player Statistics',
  schedule: 'Upcoming Fixtures', races: 'Race Results', drivers: "Drivers' Championship", teams: "Constructors' Championship",
}
const CARD_HINT: Record<string, string | undefined> = {
  scores: 'These appear on the public Scores tab. Status e.g. "FT".',
  standings: 'Rows are shown top-to-bottom on the public table. Form e.g. "W,W,D,L,W". Zone: ucl/europa/conference/relegation (football) or qualifier/eliminated (cricket).',
  players: 'Shown on the public Players tab. Leave image blank to use initials.',
  schedule: 'Upcoming fixtures shown on the public Schedule tab.',
  races: 'Finished races shown on the public Races tab.',
  drivers: 'Rows ordered top-to-bottom become the championship table.',
  teams: 'Rows ordered top-to-bottom become the constructors table.',
}
const ADD_LABEL: Record<string, string> = {
  scores: 'Add Match', standings: 'Add Team', players: 'Add Player', schedule: 'Add Fixture',
  races: 'Add Race', drivers: 'Add Driver', teams: 'Add Constructor',
}

// ---------------------------------------------------------- column configs ---
function columnsFor(sport: SportKey, tab: string): Column<Row>[] {
  if (sport === 'football') {
    switch (tab) {
      case 'scores': return [
        { key: 'homeTeam', label: 'Home', minWidth: '150px' },
        { key: 'awayTeam', label: 'Away', minWidth: '150px' },
        { key: 'homeScore', label: 'HS', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'awayScore', label: 'AS', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'status', label: 'Status', minWidth: '80px' },
        { key: 'competition', label: 'Competition', minWidth: '150px' },
        { key: 'date', label: 'Date', minWidth: '120px' },
        { key: 'time', label: 'Time', minWidth: '80px' },
        { key: 'venue', label: 'Venue', minWidth: '160px' },
      ]
      case 'standings': return [
        { key: 'team', label: 'Team', minWidth: '160px' },
        { key: 'played', label: 'P', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'won', label: 'W', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'drawn', label: 'D', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'lost', label: 'L', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'gd', label: 'GD', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'points', label: 'Pts', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'formStr', label: 'Form', minWidth: '120px' },
        { key: 'zone', label: 'Zone', minWidth: '110px' },
      ]
      case 'players': return [
        { key: 'name', label: 'Player', minWidth: '150px' },
        { key: 'team', label: 'Team', minWidth: '130px' },
        { key: 'position', label: 'Pos', minWidth: '70px' },
        { key: 'nationality', label: 'Nationality', minWidth: '120px' },
        { key: 'flag', label: 'Flag', minWidth: '64px' },
        { key: 'image', label: 'Image URL', minWidth: '160px' },
        { key: 'jersey', label: '#', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'age', label: 'Age', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'appearances', label: 'Apps', type: 'number', align: 'center', minWidth: '70px' },
        { key: 'goals', label: 'Goals', type: 'number', align: 'center', minWidth: '70px' },
        { key: 'assists', label: 'Assists', type: 'number', align: 'center', minWidth: '78px' },
        { key: 'minutesPlayed', label: 'Minutes', type: 'number', align: 'center', minWidth: '84px' },
        { key: 'passAccuracy', label: 'Pass %', type: 'number', align: 'center', minWidth: '78px' },
        { key: 'shotsPerGame', label: 'Shots/G', type: 'number', align: 'center', minWidth: '84px' },
        { key: 'keyPasses', label: 'Key Pass', type: 'number', align: 'center', minWidth: '84px' },
        { key: 'dribbles', label: 'Dribbles', type: 'number', align: 'center', minWidth: '84px' },
        { key: 'tackles', label: 'Tackles', type: 'number', align: 'center', minWidth: '80px' },
        { key: 'interceptions', label: 'Intcpt', type: 'number', align: 'center', minWidth: '78px' },
        { key: 'yellowCards', label: 'Yellow', type: 'number', align: 'center', minWidth: '74px' },
        { key: 'redCards', label: 'Red', type: 'number', align: 'center', minWidth: '60px' },
        { key: 'rating', label: 'Rating', type: 'number', align: 'center', minWidth: '74px' },
      ]
      case 'schedule': return [
        { key: 'homeTeam', label: 'Home', minWidth: '150px' },
        { key: 'awayTeam', label: 'Away', minWidth: '150px' },
        { key: 'competition', label: 'Competition', minWidth: '150px' },
        { key: 'date', label: 'Date', minWidth: '120px' },
        { key: 'time', label: 'Time', minWidth: '80px' },
        { key: 'venue', label: 'Venue', minWidth: '160px' },
      ]
    }
  }
  if (sport === 'cricket') {
    switch (tab) {
      case 'scores': return [
        { key: 'homeTeam', label: 'Home', minWidth: '150px' },
        { key: 'awayTeam', label: 'Away', minWidth: '150px' },
        { key: 'homeScore', label: 'Home Score', minWidth: '100px' },
        { key: 'awayScore', label: 'Away Score', minWidth: '100px' },
        { key: 'winner', label: 'Winner (home/away)', minWidth: '120px' },
        { key: 'result', label: 'Result', minWidth: '180px' },
        { key: 'status', label: 'Status', minWidth: '90px' },
        { key: 'competition', label: 'Competition', minWidth: '150px' },
        { key: 'date', label: 'Date', minWidth: '120px' },
        { key: 'time', label: 'Time', minWidth: '80px' },
        { key: 'venue', label: 'Venue', minWidth: '170px' },
      ]
      case 'standings': return [
        { key: 'team', label: 'Team', minWidth: '170px' },
        { key: 'played', label: 'M', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'won', label: 'W', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'lost', label: 'L', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'nrr', label: 'NRR', minWidth: '80px' },
        { key: 'points', label: 'Pts', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'formStr', label: 'Form', minWidth: '120px' },
        { key: 'zone', label: 'Zone', minWidth: '110px' },
      ]
      case 'players': return [
        { key: 'name', label: 'Player', minWidth: '150px' },
        { key: 'team', label: 'Team', minWidth: '150px' },
        { key: 'role', label: 'Role', minWidth: '100px' },
        { key: 'nationality', label: 'Nationality', minWidth: '120px' },
        { key: 'flag', label: 'Flag', minWidth: '64px' },
        { key: 'image', label: 'Image URL', minWidth: '160px' },
        { key: 'jersey', label: '#', type: 'number', align: 'center', minWidth: '56px' },
        { key: 'age', label: 'Age', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'rating', label: 'Rating', type: 'number', align: 'center', minWidth: '74px' },
        { key: 'matches', label: 'Matches', type: 'number', align: 'center', minWidth: '80px' },
        { key: 'innings', label: 'Inns', type: 'number', align: 'center', minWidth: '70px' },
        { key: 'runs', label: 'Runs', type: 'number', align: 'center', minWidth: '72px' },
        { key: 'average', label: 'Avg', type: 'number', align: 'center', minWidth: '72px' },
        { key: 'strikeRate', label: 'SR', type: 'number', align: 'center', minWidth: '72px' },
        { key: 'fifties', label: '50s', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'hundreds', label: '100s', type: 'number', align: 'center', minWidth: '68px' },
        { key: 'wickets', label: 'Wkts', type: 'number', align: 'center', minWidth: '72px' },
        { key: 'economy', label: 'Econ', type: 'number', align: 'center', minWidth: '72px' },
        { key: 'bowlingAvg', label: 'Bowl Avg', type: 'number', align: 'center', minWidth: '88px' },
        { key: 'fiveWickets', label: '5W', type: 'number', align: 'center', minWidth: '60px' },
        { key: 'catches', label: 'Catches', type: 'number', align: 'center', minWidth: '80px' },
      ]
      case 'schedule': return [
        { key: 'homeTeam', label: 'Home', minWidth: '150px' },
        { key: 'awayTeam', label: 'Away', minWidth: '150px' },
        { key: 'competition', label: 'Competition', minWidth: '150px' },
        { key: 'date', label: 'Date', minWidth: '120px' },
        { key: 'time', label: 'Time', minWidth: '80px' },
        { key: 'venue', label: 'Venue', minWidth: '170px' },
      ]
    }
  }
  if (sport === 'formula-1') {
    switch (tab) {
      case 'races': return [
        { key: 'round', label: 'Rnd', type: 'number', align: 'center', minWidth: '60px' },
        { key: 'grandPrix', label: 'Grand Prix', minWidth: '140px' },
        { key: 'flag', label: 'Flag', minWidth: '60px' },
        { key: 'circuit', label: 'Circuit', minWidth: '200px' },
        { key: 'date', label: 'Date', minWidth: '90px' },
        { key: 'winner', label: 'Winner', minWidth: '130px' },
        { key: 'winnerFlag', label: 'Win Flag', minWidth: '70px' },
        { key: 'team', label: 'Team', minWidth: '140px' },
        { key: 'laps', label: 'Laps', type: 'number', align: 'center', minWidth: '64px' },
        { key: 'time', label: 'Time', minWidth: '120px' },
      ]
      case 'drivers': return [
        { key: 'driver', label: 'Driver', minWidth: '160px' },
        { key: 'natCode', label: 'Nat', minWidth: '70px' },
        { key: 'flag', label: 'Flag', minWidth: '60px' },
        { key: 'team', label: 'Team', minWidth: '160px' },
        { key: 'points', label: 'Points', type: 'number', align: 'center', minWidth: '80px' },
      ]
      case 'teams': return [
        { key: 'team', label: 'Constructor', minWidth: '180px' },
        { key: 'color', label: 'Color (hex)', minWidth: '110px' },
        { key: 'points', label: 'Points', type: 'number', align: 'center', minWidth: '80px' },
      ]
      case 'schedule': return [
        { key: 'round', label: 'Rnd', type: 'number', align: 'center', minWidth: '60px' },
        { key: 'grandPrix', label: 'Grand Prix', minWidth: '170px' },
        { key: 'country', label: 'Country', minWidth: '120px' },
        { key: 'flag', label: 'Flag', minWidth: '60px' },
        { key: 'circuit', label: 'Circuit', minWidth: '200px' },
        { key: 'qualiDate', label: 'Quali Date', minWidth: '110px' },
        { key: 'raceDate', label: 'Race Date', minWidth: '110px' },
        { key: 'raceIso', label: 'Race ISO', minWidth: '120px' },
        { key: 'status', label: 'Status', minWidth: '110px' },
        { key: 'winner', label: 'Winner', minWidth: '120px' },
        { key: 'winnerFlag', label: 'Win Flag', minWidth: '70px' },
        { key: 'winnerTeam', label: 'Win Team', minWidth: '130px' },
      ]
    }
  }
  return []
}

function makeRow(sport: SportKey, tab: string, league: string): Row {
  const id = uid()
  if (sport === 'football') {
    if (tab === 'scores') return { id, homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0, status: 'FT', competition: league, league, date: '', time: '', venue: '' }
    if (tab === 'standings') return { id, team: '', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, formStr: '', zone: '' }
    if (tab === 'players') return { id, name: '', team: '', league, position: '', nationality: '', flag: '', image: '', jersey: 0, age: 0, appearances: 0, goals: 0, assists: 0, minutesPlayed: 0, passAccuracy: 0, shotsPerGame: 0, keyPasses: 0, dribbles: 0, tackles: 0, interceptions: 0, yellowCards: 0, redCards: 0, rating: 0 }
    if (tab === 'schedule') return { id, homeTeam: '', awayTeam: '', homeScore: null, awayScore: null, status: 'vs', competition: league, league, date: '', time: '', venue: '' }
  }
  if (sport === 'cricket') {
    if (tab === 'scores') return { id, homeTeam: '', awayTeam: '', homeScore: '', awayScore: '', winner: '', result: '', status: 'FT', competition: league, league, date: '', time: '', venue: '' }
    if (tab === 'standings') return { id, team: '', played: 0, won: 0, lost: 0, nrr: '0.00', points: 0, formStr: '', zone: '' }
    if (tab === 'players') return { id, name: '', team: '', league, role: '', nationality: '', flag: '', image: '', jersey: 0, age: 0, rating: 0, matches: 0, innings: 0, runs: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, wickets: 0, economy: 0, bowlingAvg: 0, fiveWickets: 0, catches: 0 }
    if (tab === 'schedule') return { id, homeTeam: '', awayTeam: '', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', competition: league, league, date: '', time: '', venue: '' }
  }
  if (sport === 'formula-1') {
    if (tab === 'races') return { id, round: 0, grandPrix: '', flag: '', circuit: '', date: '', winner: '', winnerFlag: '', team: '', laps: 0, time: '' }
    if (tab === 'drivers') return { id, driver: '', natCode: '', flag: '', team: '', points: 0 }
    if (tab === 'teams') return { id, team: '', color: '#9CA3AF', points: 0 }
    if (tab === 'schedule') return { id, round: 0, grandPrix: '', country: '', flag: '', circuit: '', qualiDate: '', raceDate: '', raceIso: '', status: 'upcoming', winner: '', winnerFlag: '', winnerTeam: '' }
  }
  return { id }
}

// ----------------------------------------------------------------- Card -------
function Card({ title, hint, action, children }: { title: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-orange-500" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {action}
      </div>
      {hint ? <p className="text-xs text-gray-400 mb-4">{hint}</p> : <div className="mb-4" />}
      {children}
    </div>
  )
}
