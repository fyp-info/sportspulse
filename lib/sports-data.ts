// ============================================================================
// SportsPulse — shared sports data contract
// One source of truth for: the editable (sport, league, tab) matrix, the
// mock seed used to populate the DB / fall back when a slice is missing, and
// the default knockout brackets. Imported by the Prisma seed, the API route,
// the dashboard editor, and the public pages so every layer agrees on shape.
//
// Stored shape == public-page shape. The dashboard edits these objects
// directly; the public pages render them directly. No transformation layer.
// ============================================================================

import {
  leagueStandings, leagueScores, leagueSchedule, footballPlayerDetails,
} from './mock-data/football'
import {
  cricketStandings, cricketScores, cricketSchedule, cricketPlayerDetails,
} from './mock-data/cricket'
import { f1Data, f1Schedule2026 } from './mock-data/f1'

export type SportKey = 'football' | 'cricket' | 'formula-1'

// Tabs that exist per sport (each is its own isolated DB row per league).
export const SPORT_TABS: Record<SportKey, string[]> = {
  football: ['scores', 'standings', 'players', 'schedule', 'tournament'],
  cricket: ['scores', 'standings', 'players', 'schedule', 'tournament'],
  'formula-1': ['races', 'drivers', 'teams', 'schedule'],
}

// League / season keys that the dashboard manages (the 'all' view is a public
// client-side merge, never stored).
export const SPORT_LEAGUE_KEYS: Record<SportKey, string[]> = {
  football: ['Premier League', 'Champions League', 'La Liga', 'Serie A', 'Nations League', 'FIFA World Cup'],
  cricket: ['ICC T20', 'IPL', 'PSL', 'BBL'],
  'formula-1': ['2026', '2025', '2024'],
}

export const isSportKey = (s: string): s is SportKey =>
  s === 'football' || s === 'cricket' || s === 'formula-1'

export const isValidTab = (sport: SportKey, tab: string): boolean =>
  SPORT_TABS[sport].includes(tab)

// ------------------------------------------------------- default brackets ----
export interface SportsBracketMatch {
  date?: string
  home: string | null
  away: string | null
  homeScore?: string | number | null
  awayScore?: string | number | null
  winner?: 'home' | 'away' | null
  venue?: string
}
export interface SportsBracketRound { title: string; matches: SportsBracketMatch[] }

// UEFA Champions League 2025/26 knockout bracket (was inline in the football page).
export const DEFAULT_FOOTBALL_BRACKET: SportsBracketRound[] = [
  {
    title: 'Round of 16',
    matches: [
      { date: '11 Mar', home: 'Real Madrid', away: 'Atalanta',        homeScore: 5, awayScore: 2, winner: 'home' },
      { date: '11 Mar', home: 'Arsenal',     away: 'PSV Eindhoven',   homeScore: 3, awayScore: 1, winner: 'home' },
      { date: '12 Mar', home: 'Liverpool',   away: 'Inter Milan',     homeScore: 4, awayScore: 3, winner: 'home' },
      { date: '12 Mar', home: 'Barcelona',   away: 'Benfica',         homeScore: 6, awayScore: 2, winner: 'home' },
      { date: '18 Mar', home: 'Man City',    away: 'Bayern Munich',   homeScore: 2, awayScore: 4, winner: 'away' },
      { date: '18 Mar', home: 'Paris SG',    away: 'Dortmund',        homeScore: 3, awayScore: 2, winner: 'home' },
      { date: '19 Mar', home: 'Leverkusen',  away: 'Atletico Madrid', homeScore: 2, awayScore: 3, winner: 'away' },
      { date: '19 Mar', home: 'Aston Villa', away: 'Juventus',        homeScore: 1, awayScore: 2, winner: 'away' },
    ],
  },
  {
    title: 'Quarter-finals',
    matches: [
      { date: '08 Apr', home: 'Real Madrid',     away: 'Arsenal',    homeScore: 4, awayScore: 3, winner: 'home' },
      { date: '09 Apr', home: 'Liverpool',       away: 'Barcelona',  homeScore: 2, awayScore: 1, winner: 'home' },
      { date: '15 Apr', home: 'Bayern Munich',   away: 'Paris SG',   homeScore: 1, awayScore: 3, winner: 'away' },
      { date: '16 Apr', home: 'Atletico Madrid', away: 'Juventus',   homeScore: 3, awayScore: 2, winner: 'home' },
    ],
  },
  {
    title: 'Semi-finals',
    matches: [
      { date: '29 Apr', home: 'Real Madrid', away: 'Liverpool',       homeScore: 3, awayScore: 4, winner: 'away' },
      { date: '06 May', home: 'Paris SG',    away: 'Atletico Madrid', homeScore: 2, awayScore: 1, winner: 'home' },
    ],
  },
  {
    title: 'Final',
    matches: [
      { date: '30 May · Munich', home: 'Liverpool', away: 'Paris SG', homeScore: 1, awayScore: 2, winner: 'away' },
    ],
  },
]

// ICC T20 World Cup 2026 knockout bracket (was inline in the cricket page).
export const DEFAULT_CRICKET_BRACKET: SportsBracketRound[] = [
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

// ------------------------------------------------------------- mock slice ----
/**
 * The default content for a single (sport, league, tab) slice, taken from the
 * existing mock data. Used to seed the DB and as the fallback whenever a slice
 * has not been saved yet, so the public site never goes blank.
 */
export function mockSlice(sport: SportKey, league: string, tab: string): unknown {
  if (sport === 'football') {
    switch (tab) {
      case 'scores': return leagueScores[league] ?? []
      case 'standings': return leagueStandings[league] ?? []
      case 'schedule': return leagueSchedule[league] ?? []
      case 'players': return footballPlayerDetails.filter((p) => p.league === league)
      // Only leagues with real knockout formats get a default bracket; others are empty until admin uploads.
      case 'tournament': return league === 'Champions League' ? DEFAULT_FOOTBALL_BRACKET : []
    }
  }
  if (sport === 'cricket') {
    switch (tab) {
      case 'scores': return cricketScores[league] ?? []
      case 'standings': return cricketStandings[league] ?? []
      case 'schedule': return cricketSchedule[league] ?? []
      case 'players': return cricketPlayerDetails.filter((p) => p.league === league)
      case 'tournament': return league === 'ICC T20' ? DEFAULT_CRICKET_BRACKET : []
    }
  }
  if (sport === 'formula-1') {
    const year = Number(league)
    const season = f1Data[year]
    switch (tab) {
      case 'races': return season?.races ?? []
      case 'drivers': return season?.drivers ?? []
      case 'teams': return season?.teams ?? []
      case 'schedule':
        if (year === 2026) return f1Schedule2026
        return (season?.races ?? []).map((r) => ({
          round: r.round,
          grandPrix: `${r.grandPrix} Grand Prix`,
          country: r.grandPrix,
          flag: r.flag,
          circuit: r.circuit,
          raceDate: r.date,
          status: 'completed' as const,
          winner: r.winner,
          winnerFlag: r.winnerFlag,
          winnerTeam: r.team,
        }))
    }
  }
  return []
}

/** Every (league, tab) slice for a sport, keyed `${league}::${tab}`, from mock. */
export function mockSportMatrix(sport: SportKey): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const league of SPORT_LEAGUE_KEYS[sport]) {
    for (const tab of SPORT_TABS[sport]) {
      out[`${league}::${tab}`] = mockSlice(sport, league, tab)
    }
  }
  return out
}
