export type Conference = 'East' | 'West'
export type GameResult = 'W' | 'L'

export interface NBATeamInfo {
  abbr: string
  name: string
  city: string
  color: string   // primary brand color
  color2: string  // secondary
}

export interface NBAStanding {
  pos: number
  abbr: string
  conf: Conference
  played: number
  won: number
  lost: number
  pct: string
  gb: string
  streak: string
  last10: GameResult[]
}

export interface NBAGame {
  id: string
  homeAbbr: string
  awayAbbr: string
  homeScore: number | null
  awayScore: number | null
  status: 'Final' | 'Live' | 'Upcoming'
  quarter?: string
  date: string
  time: string
  arena: string
  national?: string  // broadcast e.g. "TNT"
}

export interface NBAPlayer {
  id: number
  name: string
  abbr: string
  position: string
  jersey: number
  age: number
  height: string
  country: string
  flag: string
  rating: number
  ppg: number
  rpg: number
  apg: number
  spg: number
  bpg: number
  fgPct: number
  threePct: number
  ftPct: number
  minutes: number
  games: number
}

export interface BracketTeam {
  abbr: string
  seed: number
  wins: number
}

export interface BracketSeries {
  high: BracketTeam
  low: BracketTeam
  done: boolean
}

// ---- Team directory with brand colors ----
export const NBA_TEAMS: Record<string, NBATeamInfo> = {
  BOS: { abbr: 'BOS', name: 'Celtics',        city: 'Boston',        color: '#007A33', color2: '#BA9653' },
  NYK: { abbr: 'NYK', name: 'Knicks',         city: 'New York',      color: '#006BB6', color2: '#F58426' },
  MIL: { abbr: 'MIL', name: 'Bucks',          city: 'Milwaukee',     color: '#00471B', color2: '#EEE1C6' },
  CLE: { abbr: 'CLE', name: 'Cavaliers',      city: 'Cleveland',     color: '#860038', color2: '#FDBB30' },
  ORL: { abbr: 'ORL', name: 'Magic',          city: 'Orlando',       color: '#0077C0', color2: '#C4CED4' },
  IND: { abbr: 'IND', name: 'Pacers',         city: 'Indiana',       color: '#002D62', color2: '#FDBB30' },
  PHI: { abbr: 'PHI', name: '76ers',          city: 'Philadelphia',  color: '#006BB6', color2: '#ED174C' },
  MIA: { abbr: 'MIA', name: 'Heat',           city: 'Miami',         color: '#98002E', color2: '#F9A01B' },
  DET: { abbr: 'DET', name: 'Pistons',        city: 'Detroit',       color: '#C8102E', color2: '#1D42BA' },
  ATL: { abbr: 'ATL', name: 'Hawks',          city: 'Atlanta',       color: '#E03A3E', color2: '#26282A' },
  CHI: { abbr: 'CHI', name: 'Bulls',          city: 'Chicago',       color: '#CE1141', color2: '#000000' },
  BKN: { abbr: 'BKN', name: 'Nets',           city: 'Brooklyn',      color: '#000000', color2: '#777D84' },
  TOR: { abbr: 'TOR', name: 'Raptors',        city: 'Toronto',       color: '#CE1141', color2: '#000000' },
  CHA: { abbr: 'CHA', name: 'Hornets',        city: 'Charlotte',     color: '#1D1160', color2: '#00788C' },
  WAS: { abbr: 'WAS', name: 'Wizards',        city: 'Washington',    color: '#002B5C', color2: '#E31837' },

  OKC: { abbr: 'OKC', name: 'Thunder',        city: 'Oklahoma City', color: '#007AC1', color2: '#EF3B24' },
  DEN: { abbr: 'DEN', name: 'Nuggets',        city: 'Denver',        color: '#0E2240', color2: '#FEC524' },
  MIN: { abbr: 'MIN', name: 'Timberwolves',   city: 'Minnesota',     color: '#0C2340', color2: '#236192' },
  LAC: { abbr: 'LAC', name: 'Clippers',       city: 'LA',            color: '#C8102E', color2: '#1D428A' },
  DAL: { abbr: 'DAL', name: 'Mavericks',      city: 'Dallas',        color: '#00538C', color2: '#002B5E' },
  LAL: { abbr: 'LAL', name: 'Lakers',         city: 'LA',            color: '#552583', color2: '#FDB927' },
  PHX: { abbr: 'PHX', name: 'Suns',           city: 'Phoenix',       color: '#1D1160', color2: '#E56020' },
  NOP: { abbr: 'NOP', name: 'Pelicans',       city: 'New Orleans',   color: '#0C2340', color2: '#C8102E' },
  SAC: { abbr: 'SAC', name: 'Kings',          city: 'Sacramento',    color: '#5A2D81', color2: '#63727A' },
  GSW: { abbr: 'GSW', name: 'Warriors',       city: 'Golden State',  color: '#1D428A', color2: '#FFC72C' },
  HOU: { abbr: 'HOU', name: 'Rockets',        city: 'Houston',       color: '#CE1141', color2: '#000000' },
  MEM: { abbr: 'MEM', name: 'Grizzlies',      city: 'Memphis',       color: '#5D76A9', color2: '#12173F' },
  SAS: { abbr: 'SAS', name: 'Spurs',          city: 'San Antonio',   color: '#000000', color2: '#C4CED4' },
  UTA: { abbr: 'UTA', name: 'Jazz',           city: 'Utah',          color: '#002B5C', color2: '#00471B' },
  POR: { abbr: 'POR', name: 'Trail Blazers',  city: 'Portland',      color: '#E03A3E', color2: '#000000' },
}

export function team(abbr: string): NBATeamInfo {
  return NBA_TEAMS[abbr] ?? { abbr, name: abbr, city: abbr, color: '#6B7280', color2: '#9CA3AF' }
}

// ---- Standings ----
export const nbaStandings: NBAStanding[] = [
  // East
  { pos: 1,  abbr: 'CLE', conf: 'East', played: 60, won: 46, lost: 14, pct: '.767', gb: '—',    streak: 'W4', last10: ['W','W','W','L','W','W','L','W','W','W'] },
  { pos: 2,  abbr: 'BOS', conf: 'East', played: 60, won: 44, lost: 16, pct: '.733', gb: '2.0',  streak: 'W2', last10: ['W','W','L','W','W','W','L','W','W','L'] },
  { pos: 3,  abbr: 'NYK', conf: 'East', played: 60, won: 39, lost: 21, pct: '.650', gb: '7.0',  streak: 'L1', last10: ['W','L','W','W','L','W','W','L','W','L'] },
  { pos: 4,  abbr: 'IND', conf: 'East', played: 60, won: 35, lost: 25, pct: '.583', gb: '11.0', streak: 'W3', last10: ['W','W','W','L','W','L','W','W','L','W'] },
  { pos: 5,  abbr: 'MIL', conf: 'East', played: 60, won: 34, lost: 26, pct: '.567', gb: '12.0', streak: 'W1', last10: ['L','W','W','L','W','W','L','W','L','W'] },
  { pos: 6,  abbr: 'DET', conf: 'East', played: 60, won: 33, lost: 27, pct: '.550', gb: '13.0', streak: 'W2', last10: ['W','W','L','W','L','W','W','L','W','W'] },
  { pos: 7,  abbr: 'ORL', conf: 'East', played: 60, won: 32, lost: 28, pct: '.533', gb: '14.0', streak: 'L2', last10: ['L','L','W','W','L','W','L','W','W','L'] },
  { pos: 8,  abbr: 'MIA', conf: 'East', played: 60, won: 29, lost: 31, pct: '.483', gb: '17.0', streak: 'L1', last10: ['W','L','L','W','L','W','L','W','L','L'] },
  { pos: 9,  abbr: 'ATL', conf: 'East', played: 60, won: 28, lost: 32, pct: '.467', gb: '18.0', streak: 'W1', last10: ['L','W','L','W','L','L','W','L','W','W'] },
  { pos: 10, abbr: 'CHI', conf: 'East', played: 60, won: 26, lost: 34, pct: '.433', gb: '20.0', streak: 'L3', last10: ['W','L','L','L','W','L','W','L','L','L'] },
  { pos: 11, abbr: 'PHI', conf: 'East', played: 60, won: 23, lost: 37, pct: '.383', gb: '23.0', streak: 'L1', last10: ['L','W','L','L','W','L','L','W','L','L'] },
  { pos: 12, abbr: 'BKN', conf: 'East', played: 60, won: 21, lost: 39, pct: '.350', gb: '25.0', streak: 'L2', last10: ['L','L','W','L','L','W','L','L','W','L'] },
  { pos: 13, abbr: 'TOR', conf: 'East', played: 60, won: 20, lost: 40, pct: '.333', gb: '26.0', streak: 'W1', last10: ['L','L','W','L','L','L','W','L','L','W'] },
  { pos: 14, abbr: 'CHA', conf: 'East', played: 60, won: 16, lost: 44, pct: '.267', gb: '30.0', streak: 'L4', last10: ['L','L','L','W','L','L','L','W','L','L'] },
  { pos: 15, abbr: 'WAS', conf: 'East', played: 60, won: 12, lost: 48, pct: '.200', gb: '34.0', streak: 'L6', last10: ['L','L','L','L','W','L','L','L','L','L'] },
  // West
  { pos: 1,  abbr: 'OKC', conf: 'West', played: 60, won: 51, lost: 9,  pct: '.850', gb: '—',    streak: 'W7', last10: ['W','W','W','W','W','W','L','W','W','W'] },
  { pos: 2,  abbr: 'MEM', conf: 'West', played: 60, won: 40, lost: 20, pct: '.667', gb: '11.0', streak: 'W1', last10: ['W','L','W','W','L','W','W','L','W','W'] },
  { pos: 3,  abbr: 'DEN', conf: 'West', played: 60, won: 39, lost: 21, pct: '.650', gb: '12.0', streak: 'W3', last10: ['W','W','W','L','W','L','W','W','L','W'] },
  { pos: 4,  abbr: 'HOU', conf: 'West', played: 60, won: 38, lost: 22, pct: '.633', gb: '13.0', streak: 'L1', last10: ['W','W','L','W','W','L','W','L','W','L'] },
  { pos: 5,  abbr: 'LAL', conf: 'West', played: 60, won: 37, lost: 23, pct: '.617', gb: '14.0', streak: 'W4', last10: ['W','W','W','W','L','W','L','W','W','L'] },
  { pos: 6,  abbr: 'LAC', conf: 'West', played: 60, won: 35, lost: 25, pct: '.583', gb: '16.0', streak: 'W2', last10: ['W','W','L','W','L','W','W','L','W','L'] },
  { pos: 7,  abbr: 'MIN', conf: 'West', played: 60, won: 34, lost: 26, pct: '.567', gb: '17.0', streak: 'L1', last10: ['L','W','W','L','W','W','L','W','L','W'] },
  { pos: 8,  abbr: 'GSW', conf: 'West', played: 60, won: 33, lost: 27, pct: '.550', gb: '18.0', streak: 'W3', last10: ['W','W','W','L','W','L','W','L','W','W'] },
  { pos: 9,  abbr: 'DAL', conf: 'West', played: 60, won: 32, lost: 28, pct: '.533', gb: '19.0', streak: 'L2', last10: ['L','L','W','W','L','W','L','W','W','L'] },
  { pos: 10, abbr: 'SAC', conf: 'West', played: 60, won: 31, lost: 29, pct: '.517', gb: '20.0', streak: 'W1', last10: ['L','W','L','W','W','L','W','L','W','W'] },
  { pos: 11, abbr: 'PHX', conf: 'West', played: 60, won: 29, lost: 31, pct: '.483', gb: '22.0', streak: 'L3', last10: ['W','L','L','L','W','W','L','W','L','L'] },
  { pos: 12, abbr: 'SAS', conf: 'West', played: 60, won: 27, lost: 33, pct: '.450', gb: '24.0', streak: 'W2', last10: ['L','W','L','W','L','W','W','L','L','W'] },
  { pos: 13, abbr: 'NOP', conf: 'West', played: 60, won: 18, lost: 42, pct: '.300', gb: '33.0', streak: 'L1', last10: ['L','L','W','L','L','L','W','L','L','L'] },
  { pos: 14, abbr: 'POR', conf: 'West', played: 60, won: 17, lost: 43, pct: '.283', gb: '34.0', streak: 'L2', last10: ['L','W','L','L','W','L','L','L','W','L'] },
  { pos: 15, abbr: 'UTA', conf: 'West', played: 60, won: 14, lost: 46, pct: '.233', gb: '37.0', streak: 'L5', last10: ['L','L','L','W','L','L','L','L','W','L'] },
]

// ---- Recent scores ----
export const nbaScores: NBAGame[] = [
  { id: 'nba-s1', homeAbbr: 'BOS', awayAbbr: 'NYK', homeScore: 118, awayScore: 109, status: 'Final', date: '2026-06-11', time: '19:30', arena: 'TD Garden', national: 'TNT' },
  { id: 'nba-s2', homeAbbr: 'OKC', awayAbbr: 'DEN', homeScore: 124, awayScore: 121, status: 'Final', date: '2026-06-11', time: '20:00', arena: 'Paycom Center', national: 'ESPN' },
  { id: 'nba-s3', homeAbbr: 'LAL', awayAbbr: 'GSW', homeScore: 132, awayScore: 127, status: 'Final', date: '2026-06-10', time: '22:00', arena: 'Crypto.com Arena', national: 'ABC' },
  { id: 'nba-s4', homeAbbr: 'CLE', awayAbbr: 'MIL', homeScore: 112, awayScore: 105, status: 'Final', date: '2026-06-10', time: '19:00', arena: 'Rocket Mortgage FieldHouse' },
  { id: 'nba-s5', homeAbbr: 'MEM', awayAbbr: 'HOU', homeScore: 108, awayScore: 114, status: 'Final', date: '2026-06-10', time: '20:00', arena: 'FedExForum' },
  { id: 'nba-s6', homeAbbr: 'MIA', awayAbbr: 'ORL', homeScore: 99,  awayScore: 102, status: 'Final', date: '2026-06-09', time: '19:30', arena: 'Kaseya Center' },
  { id: 'nba-s7', homeAbbr: 'LAC', awayAbbr: 'DAL', homeScore: 116, awayScore: 110, status: 'Final', date: '2026-06-09', time: '22:30', arena: 'Intuit Dome' },
  { id: 'nba-s8', homeAbbr: 'IND', awayAbbr: 'DET', homeScore: 121, awayScore: 118, status: 'Final', date: '2026-06-09', time: '19:00', arena: 'Gainbridge Fieldhouse' },
  { id: 'nba-s9', homeAbbr: 'MIN', awayAbbr: 'SAC', homeScore: 113, awayScore: 104, status: 'Final', date: '2026-06-08', time: '20:00', arena: 'Target Center' },
]

// ---- Upcoming schedule ----
export const nbaSchedule: NBAGame[] = [
  { id: 'nba-u1', homeAbbr: 'OKC', awayAbbr: 'BOS', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-13', time: '20:00', arena: 'Paycom Center',         national: 'ABC' },
  { id: 'nba-u2', homeAbbr: 'LAL', awayAbbr: 'DEN', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-13', time: '22:30', arena: 'Crypto.com Arena',      national: 'ESPN' },
  { id: 'nba-u3', homeAbbr: 'NYK', awayAbbr: 'CLE', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-14', time: '19:30', arena: 'Madison Square Garden', national: 'TNT' },
  { id: 'nba-u4', homeAbbr: 'MEM', awayAbbr: 'MIN', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-14', time: '20:00', arena: 'FedExForum' },
  { id: 'nba-u5', homeAbbr: 'GSW', awayAbbr: 'LAC', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-15', time: '22:00', arena: 'Chase Center' },
  { id: 'nba-u6', homeAbbr: 'MIL', awayAbbr: 'IND', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-15', time: '19:00', arena: 'Fiserv Forum' },
  { id: 'nba-u7', homeAbbr: 'HOU', awayAbbr: 'DAL', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-16', time: '20:00', arena: 'Toyota Center',         national: 'NBA TV' },
  { id: 'nba-u8', homeAbbr: 'PHX', awayAbbr: 'SAC', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-16', time: '21:00', arena: 'Footprint Center' },
  { id: 'nba-u9', homeAbbr: 'MIA', awayAbbr: 'ATL', homeScore: null, awayScore: null, status: 'Upcoming', date: '2026-06-17', time: '19:30', arena: 'Kaseya Center' },
]

// ---- Players ----
export const nbaPlayers: NBAPlayer[] = [
  { id: 1,  name: 'Shai Gilgeous-Alexander', abbr: 'OKC', position: 'PG', jersey: 2,  age: 27, height: '6\'6"',  country: 'Canada',          flag: '🇨🇦', rating: 9.7, ppg: 32.6, rpg: 5.4,  apg: 6.3, spg: 1.9, bpg: 1.0, fgPct: 53.4, threePct: 37.1, ftPct: 89.8, minutes: 34.1, games: 58 },
  { id: 2,  name: 'Nikola Jokić',            abbr: 'DEN', position: 'C',  jersey: 15, age: 31, height: '6\'11"', country: 'Serbia',          flag: '🇷🇸', rating: 9.8, ppg: 29.7, rpg: 12.7, apg: 10.2,spg: 1.8, bpg: 0.6, fgPct: 57.6, threePct: 41.5, ftPct: 81.2, minutes: 36.7, games: 57 },
  { id: 3,  name: 'Luka Dončić',             abbr: 'LAL', position: 'PG', jersey: 77, age: 27, height: '6\'7"',  country: 'Slovenia',        flag: '🇸🇮', rating: 9.5, ppg: 28.2, rpg: 8.3,  apg: 8.0, spg: 1.5, bpg: 0.5, fgPct: 46.8, threePct: 36.9, ftPct: 78.4, minutes: 35.4, games: 50 },
  { id: 4,  name: 'Giannis Antetokounmpo',   abbr: 'MIL', position: 'PF', jersey: 34, age: 31, height: '6\'11"', country: 'Greece',          flag: '🇬🇷', rating: 9.6, ppg: 30.9, rpg: 11.9, apg: 6.1, spg: 0.9, bpg: 1.2, fgPct: 60.1, threePct: 25.8, ftPct: 61.4, minutes: 34.2, games: 55 },
  { id: 5,  name: 'Jayson Tatum',            abbr: 'BOS', position: 'SF', jersey: 0,  age: 28, height: '6\'8"',  country: 'United States',   flag: '🇺🇸', rating: 9.3, ppg: 27.1, rpg: 8.7,  apg: 6.0, spg: 1.1, bpg: 0.6, fgPct: 45.8, threePct: 37.5, ftPct: 83.4, minutes: 36.0, games: 59 },
  { id: 6,  name: 'Anthony Edwards',         abbr: 'MIN', position: 'SG', jersey: 5,  age: 24, height: '6\'4"',  country: 'United States',   flag: '🇺🇸', rating: 9.2, ppg: 27.8, rpg: 5.7,  apg: 4.6, spg: 1.3, bpg: 0.6, fgPct: 44.9, threePct: 40.2, ftPct: 83.7, minutes: 36.3, games: 60 },
  { id: 7,  name: 'Victor Wembanyama',       abbr: 'SAS', position: 'C',  jersey: 1,  age: 22, height: '7\'4"',  country: 'France',          flag: '🇫🇷', rating: 9.4, ppg: 24.8, rpg: 11.0, apg: 3.8, spg: 1.2, bpg: 3.9, fgPct: 47.6, threePct: 35.4, ftPct: 84.0, minutes: 33.1, games: 46 },
  { id: 8,  name: 'LeBron James',            abbr: 'LAL', position: 'SF', jersey: 23, age: 41, height: '6\'9"',  country: 'United States',   flag: '🇺🇸', rating: 9.0, ppg: 24.3, rpg: 7.8,  apg: 8.9, spg: 1.0, bpg: 0.6, fgPct: 51.2, threePct: 37.8, ftPct: 76.5, minutes: 34.6, games: 54 },
  { id: 9,  name: 'Stephen Curry',           abbr: 'GSW', position: 'PG', jersey: 30, age: 38, height: '6\'2"',  country: 'United States',   flag: '🇺🇸', rating: 9.1, ppg: 25.4, rpg: 4.5,  apg: 6.2, spg: 1.1, bpg: 0.4, fgPct: 45.1, threePct: 41.8, ftPct: 91.5, minutes: 32.8, games: 56 },
  { id: 10, name: 'Kevin Durant',            abbr: 'PHX', position: 'SF', jersey: 35, age: 37, height: '6\'11"', country: 'United States',   flag: '🇺🇸', rating: 9.0, ppg: 26.9, rpg: 6.4,  apg: 4.3, spg: 0.8, bpg: 1.3, fgPct: 52.7, threePct: 42.1, ftPct: 85.9, minutes: 36.1, games: 52 },
  { id: 11, name: 'Jalen Brunson',           abbr: 'NYK', position: 'PG', jersey: 11, age: 29, height: '6\'2"',  country: 'United States',   flag: '🇺🇸', rating: 9.0, ppg: 27.5, rpg: 3.6,  apg: 7.4, spg: 0.9, bpg: 0.2, fgPct: 48.5, threePct: 38.0, ftPct: 84.6, minutes: 35.0, games: 57 },
  { id: 12, name: 'Donovan Mitchell',        abbr: 'CLE', position: 'SG', jersey: 45, age: 29, height: '6\'3"',  country: 'United States',   flag: '🇺🇸', rating: 8.9, ppg: 24.6, rpg: 4.5,  apg: 5.0, spg: 1.4, bpg: 0.3, fgPct: 46.2, threePct: 37.4, ftPct: 82.1, minutes: 33.4, games: 55 },
]

// ---- Playoff bracket (NBA Finals path) ----
export const nbaPlayoffs: {
  east: { first: BracketSeries[]; semis: BracketSeries[]; finals: BracketSeries[] }
  west: { first: BracketSeries[]; semis: BracketSeries[]; finals: BracketSeries[] }
  finals: BracketSeries
} = {
  east: {
    first: [
      { high: { abbr: 'CLE', seed: 1, wins: 4 }, low: { abbr: 'MIA', seed: 8, wins: 1 }, done: true },
      { high: { abbr: 'IND', seed: 4, wins: 4 }, low: { abbr: 'MIL', seed: 5, wins: 2 }, done: true },
      { high: { abbr: 'BOS', seed: 2, wins: 4 }, low: { abbr: 'ORL', seed: 7, wins: 0 }, done: true },
      { high: { abbr: 'NYK', seed: 3, wins: 4 }, low: { abbr: 'DET', seed: 6, wins: 2 }, done: true },
    ],
    semis: [
      { high: { abbr: 'CLE', seed: 1, wins: 4 }, low: { abbr: 'IND', seed: 4, wins: 3 }, done: true },
      { high: { abbr: 'BOS', seed: 2, wins: 2 }, low: { abbr: 'NYK', seed: 3, wins: 4 }, done: true },
    ],
    finals: [
      { high: { abbr: 'CLE', seed: 1, wins: 3 }, low: { abbr: 'NYK', seed: 3, wins: 2 }, done: false },
    ],
  },
  west: {
    first: [
      { high: { abbr: 'OKC', seed: 1, wins: 4 }, low: { abbr: 'GSW', seed: 8, wins: 0 }, done: true },
      { high: { abbr: 'HOU', seed: 4, wins: 4 }, low: { abbr: 'LAL', seed: 5, wins: 3 }, done: true },
      { high: { abbr: 'MEM', seed: 2, wins: 3 }, low: { abbr: 'MIN', seed: 7, wins: 4 }, done: true },
      { high: { abbr: 'DEN', seed: 3, wins: 4 }, low: { abbr: 'LAC', seed: 6, wins: 1 }, done: true },
    ],
    semis: [
      { high: { abbr: 'OKC', seed: 1, wins: 4 }, low: { abbr: 'HOU', seed: 4, wins: 2 }, done: true },
      { high: { abbr: 'DEN', seed: 3, wins: 4 }, low: { abbr: 'MIN', seed: 7, wins: 3 }, done: true },
    ],
    finals: [
      { high: { abbr: 'OKC', seed: 1, wins: 4 }, low: { abbr: 'DEN', seed: 3, wins: 2 }, done: true },
    ],
  },
  finals: { high: { abbr: 'OKC', seed: 1, wins: 2 }, low: { abbr: 'CLE', seed: 1, wins: 1 }, done: false },
}
