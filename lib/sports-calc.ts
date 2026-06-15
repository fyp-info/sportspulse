// ============================================================================
// SportsPulse — derived-stat calculation engine
// Pure functions: admins upload raw counting data, these compute the rest.
// ============================================================================

export const round = (n: number, d = 1) => {
  if (!isFinite(n)) return 0
  const f = 10 ** d
  return Math.round((n + Number.EPSILON) * f) / f
}

export const pct = (made: number, attempted: number, d = 1) =>
  attempted > 0 ? round((made / attempted) * 100, d) : 0

export const perGame = (total: number, games: number, d = 1) =>
  games > 0 ? round(total / games, d) : 0

// ---------------------------------------------------------------- Cricket ----
/** Batting average = runs / times dismissed (innings - not outs). */
export const battingAvg = (runs: number, innings: number, notOuts: number) => {
  const outs = Math.max(innings - notOuts, 0)
  return outs > 0 ? round(runs / outs, 2) : round(runs, 2)
}
/** Strike rate = (runs / balls) * 100. */
export const strikeRate = (runs: number, balls: number) =>
  balls > 0 ? round((runs / balls) * 100, 1) : 0
/** Bowling economy = runs conceded / overs bowled. */
export const economy = (runsConceded: number, overs: number) =>
  overs > 0 ? round(runsConceded / overs, 2) : 0
/** Bowling average = runs conceded / wickets. */
export const bowlingAvg = (runsConceded: number, wickets: number) =>
  wickets > 0 ? round(runsConceded / wickets, 2) : 0

// --------------------------------------------------------------- Football ----
export const passAccuracy = (completed: number, attempted: number) => pct(completed, attempted)
/** Synthesized 0–10 player rating from per-game contributions. */
export const footballRating = (r: {
  games: number; goals: number; assists: number
  passAcc: number; shotsPg: number; tacklesPg: number; intPg: number
}) => {
  if (r.games <= 0) return 0
  const gpg = r.goals / r.games
  const apg = r.assists / r.games
  const score =
    6 +
    gpg * 1.6 +
    apg * 1.1 +
    (r.passAcc - 80) * 0.03 +
    r.shotsPg * 0.12 +
    r.tacklesPg * 0.18 +
    r.intPg * 0.16
  return round(Math.max(4, Math.min(10, score)), 2)
}

// ------------------------------------------------------ Standings (table) ----
export interface MatchInput {
  id: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  played?: boolean
}

export interface FootballStanding {
  team: string; p: number; w: number; d: number; l: number
  gf: number; ga: number; gd: number; pts: number
}

const blankTeams = (matches: MatchInput[]) => {
  const set = new Set<string>()
  matches.forEach((m) => {
    if (m.home?.trim()) set.add(m.home.trim())
    if (m.away?.trim()) set.add(m.away.trim())
  })
  return set
}

/** Football league table (W=3, D=1, L=0) computed from match results. */
export function footballStandings(matches: MatchInput[]): FootballStanding[] {
  const rows: Record<string, FootballStanding> = {}
  blankTeams(matches).forEach((t) => {
    rows[t] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
  })
  matches.forEach((m) => {
    if (!m.home?.trim() || !m.away?.trim()) return
    if (m.played === false) return
    const h = rows[m.home.trim()], a = rows[m.away.trim()]
    if (!h || !a) return
    const hs = Number(m.homeScore) || 0
    const as = Number(m.awayScore) || 0
    h.p++; a.p++
    h.gf += hs; h.ga += as; a.gf += as; a.ga += hs
    if (hs > as) { h.w++; h.pts += 3; a.l++ }
    else if (hs < as) { a.w++; a.pts += 3; h.l++ }
    else { h.d++; a.d++; h.pts++; a.pts++ }
  })
  return Object.values(rows)
    .map((r) => ({ ...r, gd: r.gf - r.ga }))
    .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || x.team.localeCompare(y.team))
}

export interface CricketStanding { team: string; p: number; w: number; l: number; nr: number; pts: number }

/** Cricket league table (W=2, NR=1) computed from results. */
export function cricketStandings(matches: MatchInput[]): CricketStanding[] {
  const rows: Record<string, CricketStanding> = {}
  blankTeams(matches).forEach((t) => { rows[t] = { team: t, p: 0, w: 0, l: 0, nr: 0, pts: 0 } })
  matches.forEach((m) => {
    if (!m.home?.trim() || !m.away?.trim() || m.played === false) return
    const h = rows[m.home.trim()], a = rows[m.away.trim()]
    if (!h || !a) return
    const hs = Number(m.homeScore) || 0, as = Number(m.awayScore) || 0
    h.p++; a.p++
    if (hs === as) { h.nr++; a.nr++; h.pts++; a.pts++ }
    else if (hs > as) { h.w++; h.pts += 2; a.l++ }
    else { a.w++; a.pts += 2; h.l++ }
  })
  return Object.values(rows).sort((x, y) => y.pts - x.pts || y.w - x.w || x.team.localeCompare(y.team))
}

// -------------------------------------------------------------- Formula 1 ----
export const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

export interface F1RaceResult { id: string; gp: string; results: string[] } // results = driver names, finish order

export const f1RacePoints = (position: number) => (position >= 0 && position < F1_POINTS.length ? F1_POINTS[position] : 0)

export interface F1DriverStat { name: string; points: number; wins: number; podiums: number; races: number }

export function f1DriverPoints(name: string, races: F1RaceResult[]) {
  let points = 0, wins = 0, podiums = 0, run = 0
  races.forEach((r) => {
    const pos = r.results.findIndex((d) => d === name)
    if (pos < 0) return
    run++
    points += f1RacePoints(pos)
    if (pos === 0) wins++
    if (pos < 3) podiums++
  })
  return { points, wins, podiums, races: run }
}

export function f1ConstructorStandings(
  drivers: { name: string; team: string }[],
  races: F1RaceResult[]
): { team: string; points: number; wins: number; drivers: number }[] {
  const rows: Record<string, { team: string; points: number; wins: number; drivers: number }> = {}
  drivers.forEach((d) => {
    const team = d.team?.trim() || '—'
    if (!rows[team]) rows[team] = { team, points: 0, wins: 0, drivers: 0 }
    rows[team].drivers++
    const s = f1DriverPoints(d.name, races)
    rows[team].points += s.points
    rows[team].wins += s.wins
  })
  return Object.values(rows).sort((a, b) => b.points - a.points || b.wins - a.wins)
}
