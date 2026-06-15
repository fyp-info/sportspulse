'use client'

import { Plus, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TournamentBracket, { type BracketRound } from '@/components/sports/TournamentBracket'
import type { SportKey } from './SportsManager'

const emptyMatch = () => ({ date: '', home: '', away: '', homeScore: '', awayScore: '', venue: '' })

export const emptyBracket = (): BracketRound[] => [
  { title: 'Round of 16',  matches: Array.from({ length: 8 }, emptyMatch) },
  { title: 'Quarter-finals', matches: Array.from({ length: 4 }, emptyMatch) },
  { title: 'Semi-finals',  matches: Array.from({ length: 2 }, emptyMatch) },
  { title: 'Final',        matches: [emptyMatch()] },
]

export function seedBracket(sport: SportKey, leagueId?: string): BracketRound[] {
  if (sport === 'football') {
    // ---- Champions League / Premier League ----
    if (!leagueId || leagueId === 'Premier League' || leagueId === 'Champions League') {
      return [
        { title: 'Round of 16', matches: [
          { date: 'Feb 14', home: 'Man City',   away: 'Copenhagen',    homeScore: 3, awayScore: 1, venue: 'Etihad Stadium' },
          { date: 'Feb 14', home: 'Real Madrid', away: 'Leipzig',       homeScore: 2, awayScore: 0, venue: 'Santiago Bernabéu' },
          { date: 'Feb 15', home: 'Bayern',      away: 'Lazio',         homeScore: 2, awayScore: 1, venue: 'Allianz Arena' },
          { date: 'Feb 15', home: 'Arsenal',     away: 'Porto',         homeScore: 1, awayScore: 0, venue: 'Emirates Stadium' },
          { date: 'Feb 21', home: 'PSG',         away: 'Real Sociedad', homeScore: 2, awayScore: 1, venue: 'Parc des Princes' },
          { date: 'Feb 21', home: 'Barcelona',   away: 'Napoli',        homeScore: 3, awayScore: 1, venue: 'Estadi Olímpic' },
          { date: 'Feb 22', home: 'Inter',       away: 'Atletico',      homeScore: 2, awayScore: 1, venue: 'San Siro' },
          { date: 'Feb 22', home: 'Dortmund',    away: 'PSV',           homeScore: 2, awayScore: 0, venue: 'Signal Iduna Park' },
        ]},
        { title: 'Quarter-finals', matches: [
          { date: 'Apr 9',  home: 'Man City',   away: 'Real Madrid', homeScore: 2, awayScore: 1, venue: 'Etihad Stadium' },
          { date: 'Apr 9',  home: 'Bayern',     away: 'Arsenal',     homeScore: 1, awayScore: 2, venue: 'Allianz Arena' },
          { date: 'Apr 10', home: 'PSG',        away: 'Barcelona',   homeScore: 1, awayScore: 3, venue: 'Parc des Princes' },
          { date: 'Apr 10', home: 'Inter',      away: 'Dortmund',    homeScore: 2, awayScore: 0, venue: 'San Siro' },
        ]},
        { title: 'Semi-finals', matches: [
          { date: 'Apr 30', home: 'Man City',  away: 'Arsenal', homeScore: 2, awayScore: 1, venue: 'Etihad Stadium' },
          { date: 'May 1',  home: 'Barcelona', away: 'Inter',   homeScore: 1, awayScore: 2, venue: 'Estadi Olímpic' },
        ]},
        { title: 'Final', matches: [
          { date: 'May 31', home: 'Man City', away: 'Inter', homeScore: '', awayScore: '', venue: 'Wembley Stadium' },
        ]},
      ]
    }

    // ---- La Liga — Copa del Rey ----
    if (leagueId === 'La Liga') {
      return [
        { title: 'Round of 16', matches: [
          { date: 'Jan 4',  home: 'Real Madrid',    away: 'Celta Vigo',      homeScore: 5, awayScore: 2, venue: 'Santiago Bernabéu' },
          { date: 'Jan 4',  home: 'Real Sociedad',  away: 'Osasuna',         homeScore: 2, awayScore: 1, venue: 'Reale Arena' },
          { date: 'Jan 5',  home: 'Barcelona',      away: 'Barbastro',       homeScore: 4, awayScore: 0, venue: 'Estadi Olímpic' },
          { date: 'Jan 5',  home: 'Athletic Club',  away: 'Getafe',          homeScore: 3, awayScore: 1, venue: 'San Mamés' },
          { date: 'Jan 8',  home: 'Atletico',       away: 'Marbella',        homeScore: 3, awayScore: 0, venue: 'Civitas Metropolitano' },
          { date: 'Jan 8',  home: 'Sevilla',        away: 'Valladolid',      homeScore: 2, awayScore: 0, venue: 'Ramón Sánchez-Pizjuán' },
          { date: 'Jan 9',  home: 'Villarreal',     away: 'Real Murcia',     homeScore: 3, awayScore: 0, venue: 'Estadio de la Cerámica' },
          { date: 'Jan 9',  home: 'Real Betis',     away: 'Mallorca',        homeScore: 2, awayScore: 1, venue: 'Estadio Benito Villamarín' },
        ]},
        { title: 'Quarter-finals', matches: [
          { date: 'Jan 30', home: 'Real Madrid',    away: 'Real Sociedad', homeScore: 4, awayScore: 0, venue: 'Santiago Bernabéu' },
          { date: 'Jan 30', home: 'Barcelona',      away: 'Athletic Club', homeScore: 3, awayScore: 1, venue: 'Estadi Olímpic' },
          { date: 'Jan 31', home: 'Atletico',       away: 'Sevilla',       homeScore: 2, awayScore: 0, venue: 'Civitas Metropolitano' },
          { date: 'Jan 31', home: 'Villarreal',     away: 'Real Betis',    homeScore: 1, awayScore: 2, venue: 'Estadio de la Cerámica' },
        ]},
        { title: 'Semi-finals', matches: [
          { date: 'Feb 27', home: 'Real Madrid', away: 'Barcelona',  homeScore: 3, awayScore: 2, venue: 'Santiago Bernabéu' },
          { date: 'Feb 27', home: 'Atletico',    away: 'Real Betis', homeScore: 2, awayScore: 1, venue: 'Civitas Metropolitano' },
        ]},
        { title: 'Final', matches: [
          { date: 'Apr 26', home: 'Real Madrid', away: 'Atletico', homeScore: '', awayScore: '', venue: 'Estadio de La Cartuja, Seville' },
        ]},
      ]
    }

    // ---- Serie A — Coppa Italia ----
    if (leagueId === 'Serie A') {
      return [
        { title: 'Round of 16', matches: [
          { date: 'Dec 19', home: 'Inter',      away: 'Udinese',      homeScore: 4, awayScore: 0, venue: 'San Siro' },
          { date: 'Dec 19', home: 'Napoli',     away: 'Palermo',      homeScore: 3, awayScore: 0, venue: 'Stadio Diego Armando Maradona' },
          { date: 'Jan 14', home: 'Juventus',   away: 'Cagliari',     homeScore: 4, awayScore: 1, venue: 'Allianz Stadium' },
          { date: 'Jan 14', home: 'Milan',      away: 'Sassuolo',     homeScore: 3, awayScore: 0, venue: 'San Siro' },
          { date: 'Jan 15', home: 'Roma',       away: 'Sampdoria',    homeScore: 4, awayScore: 1, venue: 'Stadio Olimpico' },
          { date: 'Jan 15', home: 'Fiorentina', away: 'Monza',        homeScore: 2, awayScore: 0, venue: 'Stadio Artemio Franchi' },
          { date: 'Jan 16', home: 'Atalanta',   away: 'Cesena',       homeScore: 3, awayScore: 1, venue: 'Gewiss Stadium' },
          { date: 'Jan 16', home: 'Lazio',      away: 'Novara',       homeScore: 4, awayScore: 0, venue: 'Stadio Olimpico' },
        ]},
        { title: 'Quarter-finals', matches: [
          { date: 'Jan 29', home: 'Inter',     away: 'Napoli',      homeScore: 3, awayScore: 1, venue: 'San Siro' },
          { date: 'Jan 30', home: 'Juventus',  away: 'Milan',       homeScore: 2, awayScore: 1, venue: 'Allianz Stadium' },
          { date: 'Jan 30', home: 'Roma',      away: 'Fiorentina',  homeScore: 1, awayScore: 0, venue: 'Stadio Olimpico' },
          { date: 'Jan 31', home: 'Atalanta',  away: 'Lazio',       homeScore: 2, awayScore: 2, venue: 'Gewiss Stadium' },
        ]},
        { title: 'Semi-finals', matches: [
          { date: 'Apr 2', home: 'Inter', away: 'Juventus', homeScore: 2, awayScore: 1, venue: 'San Siro' },
          { date: 'Apr 3', home: 'Roma',  away: 'Atalanta', homeScore: 1, awayScore: 0, venue: 'Stadio Olimpico' },
        ]},
        { title: 'Final', matches: [
          { date: 'May 14', home: 'Inter', away: 'Roma', homeScore: '', awayScore: '', venue: 'Stadio Olimpico' },
        ]},
      ]
    }

    // ---- Nations League ----
    if (leagueId === 'Nations League') {
      return [
        { title: 'Round of 16', matches: [
          { date: 'Mar 20', home: 'France',      away: 'Croatia',     homeScore: 2, awayScore: 0, venue: 'Stade de France, Paris' },
          { date: 'Mar 20', home: 'Netherlands', away: 'Turkey',      homeScore: 2, awayScore: 1, venue: 'Johan Cruyff Arena' },
          { date: 'Mar 21', home: 'Spain',       away: 'Denmark',     homeScore: 3, awayScore: 0, venue: 'Estadio de La Cartuja' },
          { date: 'Mar 21', home: 'Portugal',    away: 'Czech Rep.',  homeScore: 2, awayScore: 1, venue: 'Estádio da Luz, Lisbon' },
          { date: 'Mar 23', home: 'Germany',     away: 'Italy',       homeScore: 1, awayScore: 0, venue: 'Allianz Arena, Munich' },
          { date: 'Mar 23', home: 'Belgium',     away: 'Austria',     homeScore: 3, awayScore: 2, venue: 'King Baudouin Stadium' },
          { date: 'Mar 24', home: 'England',     away: 'Switzerland', homeScore: 2, awayScore: 1, venue: 'Wembley Stadium' },
          { date: 'Mar 24', home: 'Hungary',     away: 'Serbia',      homeScore: 1, awayScore: 0, venue: 'Puskás Aréna, Budapest' },
        ]},
        { title: 'Quarter-finals', matches: [
          { date: 'Apr 10', home: 'France',      away: 'Netherlands', homeScore: 3, awayScore: 2, venue: 'Stade de France, Paris' },
          { date: 'Apr 10', home: 'Spain',       away: 'Portugal',    homeScore: 1, awayScore: 0, venue: 'Estadio de La Cartuja' },
          { date: 'Apr 11', home: 'Germany',     away: 'Belgium',     homeScore: 2, awayScore: 1, venue: 'Allianz Arena, Munich' },
          { date: 'Apr 11', home: 'England',     away: 'Hungary',     homeScore: 2, awayScore: 0, venue: 'Wembley Stadium' },
        ]},
        { title: 'Semi-finals', matches: [
          { date: 'Jun 5', home: 'France', away: 'Germany', homeScore: 2, awayScore: 1, venue: 'Allianz Arena, Munich' },
          { date: 'Jun 6', home: 'Spain',  away: 'England', homeScore: 2, awayScore: 1, venue: 'Estadio de La Cartuja, Seville' },
        ]},
        { title: 'Final', matches: [
          { date: 'Jun 9', home: 'France', away: 'Spain', homeScore: '', awayScore: '', venue: 'Feijenoord Stadion, Rotterdam' },
        ]},
      ]
    }

    // ---- FIFA World Cup ----
    if (leagueId === 'FIFA World Cup') {
      return [
        { title: 'Round of 16', matches: [
          { date: 'Dec 3',  home: 'Brazil',      away: 'South Korea', homeScore: 4, awayScore: 1, venue: 'Stadium 974, Doha' },
          { date: 'Dec 3',  home: 'Japan',       away: 'Croatia',     homeScore: 1, awayScore: 1, venue: 'Al Janoub Stadium' },
          { date: 'Dec 4',  home: 'Argentina',   away: 'Australia',   homeScore: 2, awayScore: 1, venue: 'Ahmad Bin Ali Stadium' },
          { date: 'Dec 4',  home: 'Netherlands', away: 'USA',         homeScore: 3, awayScore: 1, venue: 'Khalifa International Stadium' },
          { date: 'Dec 5',  home: 'Morocco',     away: 'Spain',       homeScore: 0, awayScore: 0, venue: 'Education City Stadium' },
          { date: 'Dec 5',  home: 'Portugal',    away: 'Switzerland', homeScore: 6, awayScore: 1, venue: 'Lusail Stadium' },
          { date: 'Dec 6',  home: 'France',      away: 'Poland',      homeScore: 3, awayScore: 1, venue: 'Al Thumama Stadium' },
          { date: 'Dec 6',  home: 'England',     away: 'Senegal',     homeScore: 3, awayScore: 0, venue: 'Al Bayt Stadium' },
        ]},
        { title: 'Quarter-finals', matches: [
          { date: 'Dec 9',  home: 'Brazil',      away: 'Croatia',     homeScore: 1, awayScore: 1, venue: 'Education City Stadium' },
          { date: 'Dec 9',  home: 'Argentina',   away: 'Netherlands', homeScore: 2, awayScore: 2, venue: 'Lusail Stadium' },
          { date: 'Dec 10', home: 'Morocco',     away: 'Portugal',    homeScore: 1, awayScore: 0, venue: 'Al Thumama Stadium' },
          { date: 'Dec 10', home: 'France',      away: 'England',     homeScore: 2, awayScore: 1, venue: 'Al Bayt Stadium' },
        ]},
        { title: 'Semi-finals', matches: [
          { date: 'Dec 13', home: 'Argentina', away: 'Croatia', homeScore: 3, awayScore: 0, venue: 'Lusail Stadium' },
          { date: 'Dec 14', home: 'France',    away: 'Morocco', homeScore: 2, awayScore: 0, venue: 'Al Bayt Stadium' },
        ]},
        { title: 'Final', matches: [
          { date: 'Dec 18', home: 'Argentina', away: 'France', homeScore: 3, awayScore: 3, venue: 'Lusail Stadium' },
        ]},
      ]
    }
  }

  if (sport === 'cricket') {
    return [
      { title: 'Quarter-finals', matches: [
        { date: 'Jun 18', home: 'India',     away: 'Bangladesh',   homeScore: 320, awayScore: 280, venue: 'Eden Gardens, Kolkata' },
        { date: 'Jun 18', home: 'Australia', away: 'Sri Lanka',    homeScore: 301, awayScore: 250, venue: 'MCG, Melbourne' },
        { date: 'Jun 19', home: 'England',   away: 'New Zealand',  homeScore: 270, awayScore: 265, venue: "Lord's, London" },
        { date: 'Jun 19', home: 'Pakistan',  away: 'South Africa', homeScore: 240, awayScore: 238, venue: 'National Stadium, Karachi' },
      ]},
      { title: 'Semi-finals', matches: [
        { date: 'Jun 24', home: 'India',   away: 'Australia', homeScore: 287, awayScore: 250, venue: 'Eden Gardens, Kolkata' },
        { date: 'Jun 25', home: 'England', away: 'Pakistan',  homeScore: 301, awayScore: 280, venue: "Lord's, London" },
      ]},
      { title: 'Final', matches: [
        { date: 'Jun 30', home: 'India', away: 'England', homeScore: '', awayScore: '', venue: 'Narendra Modi Stadium' },
      ]},
    ]
  }
  return emptyBracket()
}

const winnerOf = (hs: string | number | null | undefined, as: string | number | null | undefined): 'home' | 'away' | null => {
  const h = Number(hs), a = Number(as)
  if (hs === '' || as === '' || hs == null || as == null || isNaN(h) || isNaN(a) || h === a) return null
  return h > a ? 'home' : 'away'
}

export default function TournamentEditor({ rounds, onChange }: { rounds: BracketRound[]; onChange: (r: BracketRound[]) => void }) {
  const setMatch = (ri: number, mi: number, key: string, value: string) => {
    onChange(rounds.map((r, i) => i !== ri ? r : {
      ...r,
      matches: r.matches.map((m, j) => j !== mi ? m : { ...m, [key]: value }),
    }))
  }

  const setRoundTitle = (ri: number, title: string) =>
    onChange(rounds.map((r, i) => i === ri ? { ...r, title } : r))

  const addRound = () =>
    onChange([...rounds, { title: `Round ${rounds.length + 1}`, matches: Array.from({ length: 2 }, emptyMatch) }])

  const removeRound = (ri: number) => onChange(rounds.filter((_, i) => i !== ri))

  // live preview rounds with winners auto-derived from scores + empty → TBD
  const previewRounds: BracketRound[] = rounds.map((r) => ({
    title: r.title,
    matches: r.matches.map((m) => ({
      date: m.date,
      home: (m.home as string)?.trim() ? m.home : null,
      away: (m.away as string)?.trim() ? m.away : null,
      homeScore: m.homeScore === '' ? null : m.homeScore,
      awayScore: m.awayScore === '' ? null : m.awayScore,
      winner: winnerOf(m.homeScore, m.awayScore),
    })),
  }))

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-400">
        Build the bracket round by round. The winner of each tie is highlighted automatically from the scores, and the preview below is exactly how it appears on the public tournament page.
      </p>

      {/* Round editors */}
      <div className="space-y-4">
        {rounds.map((round, ri) => (
          <div key={ri} className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold shrink-0">{ri + 1}</span>
              <input
                value={round.title}
                onChange={(e) => setRoundTitle(ri, e.target.value)}
                placeholder="Round name (e.g. Quarter-finals)"
                className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                onClick={() => removeRound(ri)}
                className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                title="Delete round"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {/* column labels */}
              <div className="hidden sm:grid grid-cols-[100px_1fr_88px_88px_1fr_1fr] gap-3 px-1 text-[10px] font-semibold text-gray-400 uppercase">
                <span>Date</span><span>Home</span><span className="text-center">Home Score</span><span className="text-center">Away Score</span><span>Away</span><span>Venue</span>
              </div>
              {round.matches.map((m, mi) => {
                const win = winnerOf(m.homeScore, m.awayScore)
                return (
                  <div key={mi} className="grid sm:grid-cols-[100px_1fr_88px_88px_1fr_1fr] grid-cols-1 gap-3 items-center">
                    <input value={m.date ?? ''} onChange={(e) => setMatch(ri, mi, 'date', e.target.value)} placeholder="Date"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    <input value={(m.home as string) ?? ''} onChange={(e) => setMatch(ri, mi, 'home', e.target.value)} placeholder="Home team"
                      className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${win === 'home' ? 'border-green-300 bg-green-50 font-medium' : 'border-gray-200'}`} />
                    <input value={m.homeScore ?? ''} onChange={(e) => setMatch(ri, mi, 'homeScore', e.target.value)} placeholder="—" inputMode="numeric"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    <input value={m.awayScore ?? ''} onChange={(e) => setMatch(ri, mi, 'awayScore', e.target.value)} placeholder="—" inputMode="numeric"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                    <input value={(m.away as string) ?? ''} onChange={(e) => setMatch(ri, mi, 'away', e.target.value)} placeholder="Away team"
                      className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${win === 'away' ? 'border-green-300 bg-green-50 font-medium' : 'border-gray-200'}`} />
                    <input value={(m.venue as string) ?? ''} onChange={(e) => setMatch(ri, mi, 'venue', e.target.value)} placeholder="Venue / Stadium"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={addRound}>
        <Plus className="h-4 w-4" /> Add Round
      </Button>

      {/* Live bracket preview */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Eye className="h-4 w-4" /> Live Bracket Preview
        </div>
        <TournamentBracket rounds={previewRounds} />
      </div>
    </div>
  )
}
