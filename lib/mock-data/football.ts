export type FormResult = 'W' | 'D' | 'L'
export type ZoneType = 'ucl' | 'europa' | 'conference' | 'relegation' | ''

export interface FootballStanding {
  pos: number
  team: string
  played: number
  won: number
  drawn: number
  lost: number
  gd: number
  points: number
  form: FormResult[]
  zone: ZoneType
}

export interface FootballMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: string
  competition: string
  league: string
  date: string
  time: string
  venue: string
  homeFlag?: string
  awayFlag?: string
}

export interface MatchDetail extends FootballMatch {
  stats?: {
    possession: [number, number]
    shotsOnTarget: [number, number]
    totalShots: [number, number]
    corners: [number, number]
    fouls: [number, number]
    yellowCards: [number, number]
    redCards: [number, number]
    offsides: [number, number]
    passAccuracy: [number, number]
    saves: [number, number]
  }
  goals?: { minute: number; scorer: string; team: 'home' | 'away'; type: string }[]
  homeLineup?: string[]
  awayLineup?: string[]
  homeSubs?: string[]
  awaySubs?: string[]
  referee: string
  attendance: string
}

export interface FootballPlayerDetail {
  id: number
  name: string
  team: string
  league: string
  position: string
  age: number
  nationality: string
  flag: string
  image: string
  jersey: number
  appearances: number
  goals: number
  assists: number
  minutesPlayed: number
  passAccuracy: number
  shotsPerGame: number
  keyPasses: number
  dribbles: number
  tackles: number
  interceptions: number
  yellowCards: number
  redCards: number
  rating: number
}

export const FOOTBALL_LEAGUES = [
  { id: 'all',              name: 'All',               logo: null,                          emoji: '⚽' },
  { id: 'Premier League',   name: 'Premier League',    logo: '/Premier League logo.png',     emoji: '🇬🇧' },
  { id: 'Champions League', name: 'Champions League',  logo: '/ucl logo.png',               emoji: '⭐' },
  { id: 'La Liga',          name: 'La Liga',           logo: '/la liga logo.png',            emoji: '🇪🇸' },
  { id: 'Serie A',          name: 'Serie A',           logo: '/serie a logo.png',            emoji: '🇮🇹' },
  { id: 'Nations League',   name: 'Nations League',    logo: '/Nations League logo.png',     emoji: '🏅' },
  { id: 'FIFA World Cup',   name: 'FIFA World Cup',    logo: '/fifa logo.png',               emoji: '🌍' },
]

export const leagueStandings: Record<string, FootballStanding[]> = {
  'Premier League': [
    { pos: 1, team: 'Manchester City', played: 30, won: 22, drawn: 5, lost: 3, gd: 45, points: 71, form: ['W','W','D','W','W'], zone: 'ucl' },
    { pos: 2, team: 'Arsenal', played: 30, won: 21, drawn: 4, lost: 5, gd: 38, points: 67, form: ['W','W','W','D','L'], zone: 'ucl' },
    { pos: 3, team: 'Liverpool', played: 30, won: 20, drawn: 6, lost: 4, gd: 40, points: 66, form: ['D','W','W','W','L'], zone: 'ucl' },
    { pos: 4, team: 'Aston Villa', played: 30, won: 18, drawn: 3, lost: 9, gd: 20, points: 57, form: ['W','D','L','W','W'], zone: 'ucl' },
    { pos: 5, team: 'Chelsea', played: 30, won: 14, drawn: 8, lost: 8, gd: 12, points: 50, form: ['D','D','W','L','W'], zone: 'europa' },
    { pos: 6, team: 'Tottenham', played: 30, won: 13, drawn: 6, lost: 11, gd: 8, points: 45, form: ['L','W','L','D','W'], zone: 'europa' },
    { pos: 7, team: 'Newcastle', played: 30, won: 12, drawn: 7, lost: 11, gd: 5, points: 43, form: ['W','L','D','W','L'], zone: 'conference' },
    { pos: 8, team: 'Man United', played: 30, won: 10, drawn: 8, lost: 12, gd: -5, points: 38, form: ['L','L','D','W','L'], zone: '' },
    { pos: 9, team: 'Brighton', played: 30, won: 9, drawn: 8, lost: 13, gd: -2, points: 35, form: ['D','W','L','D','W'], zone: '' },
    { pos: 10, team: 'Fulham', played: 30, won: 8, drawn: 9, lost: 13, gd: -8, points: 33, form: ['L','D','L','W','D'], zone: '' },
    { pos: 11, team: 'Brentford', played: 30, won: 7, drawn: 7, lost: 16, gd: -12, points: 28, form: ['L','W','D','L','L'], zone: '' },
    { pos: 12, team: 'Crystal Palace', played: 30, won: 7, drawn: 6, lost: 17, gd: -14, points: 27, form: ['L','D','W','L','L'], zone: '' },
    { pos: 13, team: 'Everton', played: 30, won: 7, drawn: 5, lost: 18, gd: -16, points: 26, form: ['D','L','D','L','W'], zone: '' },
    { pos: 14, team: 'Nottm Forest', played: 30, won: 6, drawn: 7, lost: 17, gd: -18, points: 25, form: ['L','W','L','D','L'], zone: '' },
    { pos: 15, team: 'Burnley', played: 30, won: 6, drawn: 5, lost: 19, gd: -20, points: 23, form: ['L','L','D','L','W'], zone: '' },
    { pos: 16, team: 'Sheffield Utd', played: 30, won: 5, drawn: 6, lost: 19, gd: -22, points: 21, form: ['L','D','L','L','D'], zone: '' },
    { pos: 17, team: 'Luton Town', played: 30, won: 4, drawn: 6, lost: 20, gd: -25, points: 18, form: ['D','L','L','D','L'], zone: '' },
    { pos: 18, team: 'Wolves', played: 30, won: 5, drawn: 5, lost: 20, gd: -22, points: 20, form: ['L','D','L','L','W'], zone: 'relegation' },
    { pos: 19, team: 'Luton', played: 30, won: 4, drawn: 5, lost: 21, gd: -28, points: 17, form: ['L','L','D','L','L'], zone: 'relegation' },
    { pos: 20, team: 'Southampton', played: 30, won: 3, drawn: 4, lost: 23, gd: -35, points: 13, form: ['L','L','L','D','L'], zone: 'relegation' },
  ],
  'La Liga': [
    { pos: 1, team: 'Real Madrid', played: 32, won: 24, drawn: 5, lost: 3, gd: 58, points: 77, form: ['W','W','W','W','D'], zone: 'ucl' },
    { pos: 2, team: 'Barcelona', played: 32, won: 23, drawn: 4, lost: 5, gd: 46, points: 73, form: ['W','W','D','W','W'], zone: 'ucl' },
    { pos: 3, team: 'Atletico Madrid', played: 32, won: 20, drawn: 5, lost: 7, gd: 28, points: 65, form: ['W','L','W','W','D'], zone: 'ucl' },
    { pos: 4, team: 'Athletic Club', played: 32, won: 17, drawn: 6, lost: 9, gd: 18, points: 57, form: ['D','W','W','L','W'], zone: 'ucl' },
    { pos: 5, team: 'Real Sociedad', played: 32, won: 14, drawn: 8, lost: 10, gd: 8, points: 50, form: ['D','D','W','D','L'], zone: 'europa' },
    { pos: 6, team: 'Villarreal', played: 32, won: 13, drawn: 7, lost: 12, gd: 5, points: 46, form: ['W','L','D','L','D'], zone: 'europa' },
    { pos: 7, team: 'Sevilla', played: 32, won: 12, drawn: 6, lost: 14, gd: -3, points: 42, form: ['L','W','D','L','W'], zone: '' },
    { pos: 8, team: 'Valencia', played: 32, won: 8, drawn: 7, lost: 17, gd: -14, points: 31, form: ['L','D','L','D','L'], zone: '' },
    { pos: 18, team: 'Cadiz', played: 32, won: 5, drawn: 5, lost: 22, gd: -28, points: 20, form: ['L','L','D','L','L'], zone: 'relegation' },
    { pos: 19, team: 'Almeria', played: 32, won: 4, drawn: 3, lost: 25, gd: -35, points: 15, form: ['L','L','L','D','L'], zone: 'relegation' },
  ],
  'Champions League': [
    { pos: 1, team: 'Real Madrid', played: 6, won: 5, drawn: 1, lost: 0, gd: 12, points: 16, form: ['W','W','W','W','D'], zone: 'ucl' },
    { pos: 2, team: 'Bayern Munich', played: 6, won: 3, drawn: 2, lost: 1, gd: 4, points: 11, form: ['W','D','W','L','D'], zone: 'ucl' },
    { pos: 3, team: 'Inter Milan', played: 6, won: 2, drawn: 1, lost: 3, gd: -3, points: 7, form: ['L','W','D','L','W'], zone: '' },
    { pos: 4, team: 'Copenhagen', played: 6, won: 0, drawn: 0, lost: 6, gd: -13, points: 0, form: ['L','L','L','L','L'], zone: 'relegation' },
  ],
  'Nations League': [
    { pos: 1, team: '🇫🇷 France', played: 6, won: 4, drawn: 1, lost: 1, gd: 8, points: 13, form: ['W','W','D','W','L'], zone: 'ucl' },
    { pos: 2, team: '🇵🇹 Portugal', played: 6, won: 4, drawn: 0, lost: 2, gd: 6, points: 12, form: ['W','W','L','W','L'], zone: 'ucl' },
    { pos: 3, team: '🇩🇪 Germany', played: 6, won: 2, drawn: 1, lost: 3, gd: -2, points: 7, form: ['D','L','W','L','W'], zone: '' },
    { pos: 4, team: '🇭🇷 Croatia', played: 6, won: 0, drawn: 2, lost: 4, gd: -12, points: 2, form: ['D','L','L','D','L'], zone: 'relegation' },
  ],
  'FIFA World Cup': [
    { pos: 1, team: '🇧🇷 Brazil', played: 3, won: 2, drawn: 1, lost: 0, gd: 5, points: 7, form: ['W','W','D'], zone: 'ucl' },
    { pos: 2, team: '🇦🇷 Argentina', played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6, form: ['W','W','L'], zone: 'ucl' },
    { pos: 3, team: '🇵🇹 Portugal', played: 3, won: 1, drawn: 1, lost: 1, gd: 1, points: 4, form: ['D','W','L'], zone: '' },
    { pos: 4, team: '🇯🇵 Japan', played: 3, won: 0, drawn: 0, lost: 3, gd: -9, points: 0, form: ['L','L','L'], zone: 'relegation' },
  ],
  'Serie A': [
    { pos: 1, team: 'Inter Milan', played: 33, won: 23, drawn: 6, lost: 4, gd: 48, points: 75, form: ['W','W','W','D','W'], zone: 'ucl' },
    { pos: 2, team: 'AC Milan', played: 33, won: 22, drawn: 5, lost: 6, gd: 36, points: 71, form: ['W','D','W','W','L'], zone: 'ucl' },
    { pos: 3, team: 'Juventus', played: 33, won: 19, drawn: 7, lost: 7, gd: 24, points: 64, form: ['W','W','D','L','W'], zone: 'ucl' },
    { pos: 4, team: 'Napoli', played: 33, won: 17, drawn: 6, lost: 10, gd: 16, points: 57, form: ['W','L','D','W','W'], zone: 'ucl' },
    { pos: 5, team: 'AS Roma', played: 33, won: 15, drawn: 5, lost: 13, gd: 8, points: 50, form: ['L','W','L','W','D'], zone: 'europa' },
    { pos: 6, team: 'Lazio', played: 33, won: 13, drawn: 8, lost: 12, gd: 4, points: 47, form: ['D','L','W','D','L'], zone: 'europa' },
    { pos: 7, team: 'Fiorentina', played: 33, won: 12, drawn: 6, lost: 15, gd: -2, points: 42, form: ['W','D','L','D','W'], zone: '' },
    { pos: 8, team: 'Atalanta', played: 33, won: 11, drawn: 7, lost: 15, gd: -4, points: 40, form: ['L','W','L','D','W'], zone: '' },
    { pos: 18, team: 'Empoli', played: 33, won: 6, drawn: 4, lost: 23, gd: -30, points: 22, form: ['L','L','D','L','L'], zone: 'relegation' },
    { pos: 19, team: 'Frosinone', played: 33, won: 4, drawn: 5, lost: 24, gd: -35, points: 17, form: ['L','L','L','D','L'], zone: 'relegation' },
    { pos: 20, team: 'Salernitana', played: 33, won: 3, drawn: 4, lost: 26, gd: -42, points: 13, form: ['L','L','D','L','L'], zone: 'relegation' },
  ],
}

export const leagueScores: Record<string, FootballMatch[]> = {
  'all': [
    { id: 'pl-1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 2, status: 'FT', competition: 'Premier League', league: 'Premier League', date: '2026-06-07', time: '16:30', venue: 'Etihad Stadium' },
    { id: 'ucl-1', homeTeam: 'Real Madrid', awayTeam: 'Bayern Munich', homeScore: 4, awayScore: 2, status: 'FT', competition: 'UCL Final', league: 'Champions League', date: '2026-06-01', time: '20:00', venue: 'Wembley Stadium' },
    { id: 'll-1', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 3, awayScore: 1, status: 'FT', competition: 'La Liga', league: 'La Liga', date: '2026-06-05', time: '20:00', venue: 'Santiago Bernabéu' },
    { id: 'nl-1', homeTeam: '🇫🇷 France', awayTeam: '🇵🇹 Portugal', homeScore: 3, awayScore: 2, status: 'FT', competition: 'Nations League', league: 'Nations League', date: '2026-06-08', time: '20:45', venue: 'Stade de France', homeFlag: '🇫🇷', awayFlag: '🇵🇹' },
    { id: 'sa-1', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', homeScore: 2, awayScore: 1, status: 'FT', competition: 'Serie A', league: 'Serie A', date: '2026-06-06', time: '20:45', venue: 'San Siro' },
    { id: 'wc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇦🇷 Argentina', homeScore: 3, awayScore: 1, status: 'FT', competition: 'FIFA World Cup', league: 'FIFA World Cup', date: '2026-06-10', time: '22:00', venue: 'MetLife Stadium', homeFlag: '🇧🇷', awayFlag: '🇦🇷' },
  ],
  'Premier League': [
    { id: 'pl-1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 2, status: 'FT', competition: 'Premier League', league: 'Premier League', date: '2026-06-07', time: '16:30', venue: 'Etihad Stadium' },
    { id: 'pl-2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', homeScore: 3, awayScore: 1, status: 'FT', competition: 'Premier League', league: 'Premier League', date: '2026-06-06', time: '14:00', venue: 'Anfield' },
    { id: 'pl-3', homeTeam: 'Aston Villa', awayTeam: 'Tottenham', homeScore: 1, awayScore: 0, status: 'FT', competition: 'Premier League', league: 'Premier League', date: '2026-06-05', time: '16:00', venue: 'Villa Park' },
    { id: 'pl-4', homeTeam: 'Man United', awayTeam: 'Newcastle', homeScore: 0, awayScore: 2, status: 'FT', competition: 'Premier League', league: 'Premier League', date: '2026-06-05', time: '14:00', venue: 'Old Trafford' },
  ],
  'Champions League': [
    { id: 'ucl-1', homeTeam: 'Real Madrid', awayTeam: 'Bayern Munich', homeScore: 4, awayScore: 2, status: 'FT', competition: 'UCL Final', league: 'Champions League', date: '2026-06-01', time: '20:00', venue: 'Wembley Stadium' },
    { id: 'ucl-2', homeTeam: 'Manchester City', awayTeam: 'Inter Milan', homeScore: 3, awayScore: 1, status: 'FT', competition: 'UCL Semi-final', league: 'Champions League', date: '2026-05-14', time: '20:00', venue: 'Etihad Stadium' },
    { id: 'ucl-3', homeTeam: 'Bayern Munich', awayTeam: 'Arsenal', homeScore: 2, awayScore: 0, status: 'FT', competition: 'UCL Quarter-final', league: 'Champions League', date: '2026-05-10', time: '20:00', venue: 'Allianz Arena' },
  ],
  'La Liga': [
    { id: 'll-1', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 3, awayScore: 1, status: 'FT', competition: 'La Liga', league: 'La Liga', date: '2026-06-05', time: '20:00', venue: 'Santiago Bernabéu' },
    { id: 'll-2', homeTeam: 'Atletico Madrid', awayTeam: 'Sevilla', homeScore: 2, awayScore: 0, status: 'FT', competition: 'La Liga', league: 'La Liga', date: '2026-06-04', time: '18:30', venue: 'Cívitas Metropolitano' },
    { id: 'll-3', homeTeam: 'Barcelona', awayTeam: 'Athletic Club', homeScore: 2, awayScore: 2, status: 'FT', competition: 'La Liga', league: 'La Liga', date: '2026-06-02', time: '20:00', venue: 'Camp Nou' },
  ],
  'Serie A': [
    { id: 'sa-1', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', homeScore: 2, awayScore: 1, status: 'FT', competition: 'Serie A', league: 'Serie A', date: '2026-06-06', time: '20:45', venue: 'San Siro' },
    { id: 'sa-2', homeTeam: 'Juventus', awayTeam: 'Napoli', homeScore: 1, awayScore: 1, status: 'FT', competition: 'Serie A', league: 'Serie A', date: '2026-06-05', time: '20:45', venue: 'Allianz Stadium' },
    { id: 'sa-3', homeTeam: 'AC Milan', awayTeam: 'AS Roma', homeScore: 3, awayScore: 0, status: 'FT', competition: 'Serie A', league: 'Serie A', date: '2026-06-03', time: '18:00', venue: 'San Siro' },
  ],
  'Nations League': [
    { id: 'nl-1', homeTeam: '🇫🇷 France', awayTeam: '🇵🇹 Portugal', homeScore: 3, awayScore: 2, status: 'FT', competition: 'Nations League', league: 'Nations League', date: '2026-06-08', time: '20:45', venue: 'Stade de France', homeFlag: '🇫🇷', awayFlag: '🇵🇹' },
    { id: 'nl-2', homeTeam: '🇪🇸 Spain', awayTeam: '🇩🇪 Germany', homeScore: 2, awayScore: 0, status: 'FT', competition: 'Nations League', league: 'Nations League', date: '2026-06-06', time: '20:45', venue: 'Estadio de La Cartuja', homeFlag: '🇪🇸', awayFlag: '🇩🇪' },
    { id: 'nl-3', homeTeam: '🇳🇱 Netherlands', awayTeam: '🇩🇪 Germany', homeScore: 1, awayScore: 1, status: 'FT', competition: 'Nations League', league: 'Nations League', date: '2026-06-04', time: '20:45', venue: 'Johan Cruyff Arena', homeFlag: '🇳🇱', awayFlag: '🇩🇪' },
  ],
  'FIFA World Cup': [
    { id: 'wc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇦🇷 Argentina', homeScore: 3, awayScore: 1, status: 'FT', competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-10', time: '22:00', venue: 'MetLife Stadium', homeFlag: '🇧🇷', awayFlag: '🇦🇷' },
    { id: 'wc-2', homeTeam: '🇫🇷 France', awayTeam: '🇩🇪 Germany', homeScore: 2, awayScore: 2, status: 'FT', competition: 'FIFA World Cup – Group A', league: 'FIFA World Cup', date: '2026-06-09', time: '22:00', venue: 'SoFi Stadium', homeFlag: '🇫🇷', awayFlag: '🇩🇪' },
    { id: 'wc-3', homeTeam: '🇵🇹 Portugal', awayTeam: '🇯🇵 Japan', homeScore: 4, awayScore: 0, status: 'FT', competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-07', time: '19:00', venue: 'Rose Bowl', homeFlag: '🇵🇹', awayFlag: '🇯🇵' },
  ],
}

export const leagueSchedule: Record<string, FootballMatch[]> = {
  'all': [
    { id: 'spl-1', homeTeam: 'Arsenal', awayTeam: 'Manchester City', homeScore: null, awayScore: null, status: 'vs', competition: 'Premier League', league: 'Premier League', date: '2026-06-14', time: '16:30', venue: 'Emirates Stadium' },
    { id: 'sll-1', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', homeScore: null, awayScore: null, status: 'vs', competition: 'La Liga', league: 'La Liga', date: '2026-06-15', time: '20:00', venue: 'Camp Nou' },
    { id: 'snl-1', homeTeam: '🇫🇷 France', awayTeam: '🇩🇪 Germany', homeScore: null, awayScore: null, status: 'vs', competition: 'Nations League', league: 'Nations League', date: '2026-06-18', time: '20:45', venue: 'Stade de France', homeFlag: '🇫🇷', awayFlag: '🇩🇪' },
    { id: 'ssa-1', homeTeam: 'Inter Milan', awayTeam: 'Juventus', homeScore: null, awayScore: null, status: 'vs', competition: 'Serie A', league: 'Serie A', date: '2026-06-19', time: '20:45', venue: 'San Siro' },
    { id: 'swc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇵🇹 Portugal', homeScore: null, awayScore: null, status: 'vs', competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-22', time: '22:00', venue: 'AT&T Stadium', homeFlag: '🇧🇷', awayFlag: '🇵🇹' },
  ],
  'Premier League': [
    { id: 'spl-1', homeTeam: 'Arsenal', awayTeam: 'Manchester City', homeScore: null, awayScore: null, status: 'vs', competition: 'Premier League', league: 'Premier League', date: '2026-06-14', time: '16:30', venue: 'Emirates Stadium' },
    { id: 'spl-2', homeTeam: 'Liverpool', awayTeam: 'Tottenham', homeScore: null, awayScore: null, status: 'vs', competition: 'Premier League', league: 'Premier League', date: '2026-06-16', time: '14:00', venue: 'Anfield' },
    { id: 'spl-3', homeTeam: 'Chelsea', awayTeam: 'Aston Villa', homeScore: null, awayScore: null, status: 'vs', competition: 'Premier League', league: 'Premier League', date: '2026-06-18', time: '14:00', venue: 'Stamford Bridge' },
  ],
  'Champions League': [
    { id: 'sucl-1', homeTeam: 'Real Madrid', awayTeam: 'Arsenal', homeScore: null, awayScore: null, status: 'vs', competition: 'UCL Qualifying', league: 'Champions League', date: '2026-07-30', time: '20:00', venue: 'Wembley Stadium' },
  ],
  'La Liga': [
    { id: 'sll-1', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', homeScore: null, awayScore: null, status: 'vs', competition: 'La Liga', league: 'La Liga', date: '2026-06-15', time: '20:00', venue: 'Camp Nou' },
    { id: 'sll-2', homeTeam: 'Atletico Madrid', awayTeam: 'Real Sociedad', homeScore: null, awayScore: null, status: 'vs', competition: 'La Liga', league: 'La Liga', date: '2026-06-17', time: '18:30', venue: 'Cívitas Metropolitano' },
  ],
  'Serie A': [
    { id: 'ssa-1', homeTeam: 'Inter Milan', awayTeam: 'Juventus', homeScore: null, awayScore: null, status: 'vs', competition: 'Serie A', league: 'Serie A', date: '2026-06-19', time: '20:45', venue: 'San Siro' },
    { id: 'ssa-2', homeTeam: 'AC Milan', awayTeam: 'Napoli', homeScore: null, awayScore: null, status: 'vs', competition: 'Serie A', league: 'Serie A', date: '2026-06-21', time: '18:00', venue: 'San Siro' },
  ],
  'Nations League': [
    { id: 'snl-1', homeTeam: '🇫🇷 France', awayTeam: '🇩🇪 Germany', homeScore: null, awayScore: null, status: 'vs', competition: 'Nations League', league: 'Nations League', date: '2026-06-18', time: '20:45', venue: 'Stade de France', homeFlag: '🇫🇷', awayFlag: '🇩🇪' },
    { id: 'snl-2', homeTeam: '🇪🇸 Spain', awayTeam: '🇵🇹 Portugal', homeScore: null, awayScore: null, status: 'vs', competition: 'Nations League', league: 'Nations League', date: '2026-06-20', time: '20:45', venue: 'Santiago Bernabéu', homeFlag: '🇪🇸', awayFlag: '🇵🇹' },
  ],
  'FIFA World Cup': [
    { id: 'swc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇵🇹 Portugal', homeScore: null, awayScore: null, status: 'vs', competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-22', time: '22:00', venue: 'AT&T Stadium', homeFlag: '🇧🇷', awayFlag: '🇵🇹' },
    { id: 'swc-2', homeTeam: '🇦🇷 Argentina', awayTeam: '🇯🇵 Japan', homeScore: null, awayScore: null, status: 'vs', competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-24', time: '19:00', venue: 'Rose Bowl', homeFlag: '🇦🇷', awayFlag: '🇯🇵' },
  ],
}

export const matchDetails: Record<string, MatchDetail> = {
  'pl-1': {
    id: 'pl-1', homeTeam: 'Manchester City', awayTeam: 'Arsenal', homeScore: 2, awayScore: 2, status: 'FT',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-07', time: '16:30',
    venue: 'Etihad Stadium, Manchester', referee: 'Michael Oliver', attendance: '53,400',
    stats: { possession: [58,42], shotsOnTarget: [7,6], totalShots: [16,12], corners: [7,4], fouls: [9,14], yellowCards: [1,3], redCards: [0,0], offsides: [2,1], passAccuracy: [89,83], saves: [4,5] },
    goals: [
      { minute: 18, scorer: 'Phil Foden', team: 'home', type: 'goal' },
      { minute: 34, scorer: 'Bukayo Saka', team: 'away', type: 'goal' },
      { minute: 67, scorer: 'Erling Haaland', team: 'home', type: 'goal' },
      { minute: 89, scorer: 'Leandro Trossard', team: 'away', type: 'goal' },
    ],
    homeLineup: ['Ederson','K. Walker','M. Akanji','R. Dias','J. Gvardiol','Rodri','K. De Bruyne','B. Silva','P. Foden','J. Doku','E. Haaland'],
    awayLineup: ['D. Raya','B. White','W. Saliba','G. Magalhães','O. Zinchenko','T. Partey','M. Ødegaard','D. Rice','B. Saka','L. Trossard','G. Martinelli'],
    homeSubs: ["I. Gündoğan 72'","J. Bobb 80'"],
    awaySubs: ["E. Nketiah 68'","F. Vieira 75'"],
  },
  'pl-2': {
    id: 'pl-2', homeTeam: 'Liverpool', awayTeam: 'Chelsea', homeScore: 3, awayScore: 1, status: 'FT',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-06', time: '14:00',
    venue: 'Anfield, Liverpool', referee: 'Anthony Taylor', attendance: '54,074',
    stats: { possession: [55,45], shotsOnTarget: [8,4], totalShots: [17,10], corners: [8,4], fouls: [10,12], yellowCards: [1,2], redCards: [0,0], offsides: [3,2], passAccuracy: [86,82], saves: [3,5] },
    goals: [
      { minute: 22, scorer: 'Mohamed Salah', team: 'home', type: 'goal' },
      { minute: 47, scorer: 'Cole Palmer', team: 'away', type: 'goal' },
      { minute: 61, scorer: 'Darwin Núñez', team: 'home', type: 'goal' },
      { minute: 88, scorer: 'Mohamed Salah', team: 'home', type: 'penalty' },
    ],
    homeLineup: ['A. Becker','T. Alexander-Arnold','V. van Dijk','I. Konaté','A. Robertson','W. Jones','A. Mac Allister','D. Gravenberch','M. Salah','D. Núñez','L. Díaz'],
    awayLineup: ['R. Sánchez','R. James','T. Silva','L. Colwill','M. Cucurella','M. Caicedo','E. Fernandez','C. Gallagher','C. Palmer','N. Jackson','R. Sterling'],
    homeSubs: ["C. Gakpo 70'","H. Elliott 79'"],
    awaySubs: ["A. Mudryk 60'","B. Gilchrist 74'"],
  },
  'pl-3': {
    id: 'pl-3', homeTeam: 'Aston Villa', awayTeam: 'Tottenham', homeScore: 1, awayScore: 0, status: 'FT',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-05', time: '16:00',
    venue: 'Villa Park, Birmingham', referee: 'Stuart Attwell', attendance: '42,785',
    stats: { possession: [50,50], shotsOnTarget: [5,3], totalShots: [13,11], corners: [5,6], fouls: [11,13], yellowCards: [2,3], redCards: [0,0], offsides: [1,2], passAccuracy: [83,84], saves: [3,4] },
    goals: [{ minute: 55, scorer: 'Ollie Watkins', team: 'home', type: 'goal' }],
    homeLineup: ['E. Martínez','M. Cash','E. Konsa','P. Torres','L. Digne','D. Luiz','Y. Tielemans','J. Ramsey','O. Watkins','L. Bailey','L. Doku'],
    awayLineup: ['G. Vicario','P. Porro','C. Romero','M. van de Ven','D. Udogie','Y. Bissouma','R. Bentancur','J. Maddison','D. Kulusevski','H. Son','R. Richarlison'],
    homeSubs: ["J. Duran 80'","B. Kamara 85'"],
    awaySubs: ["W. Odobert 68'","L. Bergvall 75'"],
  },
  'pl-4': {
    id: 'pl-4', homeTeam: 'Man United', awayTeam: 'Newcastle', homeScore: 0, awayScore: 2, status: 'FT',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-05', time: '14:00',
    venue: 'Old Trafford, Manchester', referee: 'Craig Pawson', attendance: '73,297',
    stats: { possession: [46,54], shotsOnTarget: [3,7], totalShots: [9,14], corners: [4,7], fouls: [14,10], yellowCards: [3,1], redCards: [0,0], offsides: [1,3], passAccuracy: [80,85], saves: [5,2] },
    goals: [
      { minute: 38, scorer: 'Alexander Isak', team: 'away', type: 'goal' },
      { minute: 74, scorer: 'Alexander Isak', team: 'away', type: 'goal' },
    ],
    homeLineup: ['A. Onana','V. Lindelof','R. Hojlund','H. Maguire','L. Shaw','S. McTominay','K. Mainoo','B. Fernandes','M. Rashford','J. Sancho','A. Martial'],
    awayLineup: ['N. Pope','K. Trippier','S. Longstaff','F. Schär','D. Burn','B. Guimarães','T. Joelinton','S. Almiron','A. Gordon','A. Isak','C. Wilson'],
    homeSubs: ["C. Gallagher 60'","F. Amrabat 70'"],
    awaySubs: ["H. Barnes 72'","E. Anderson 80'"],
  },
  'ucl-1': {
    id: 'ucl-1', homeTeam: 'Real Madrid', awayTeam: 'Bayern Munich', homeScore: 4, awayScore: 2, status: 'FT',
    competition: 'UEFA Champions League Final', league: 'Champions League', date: '2026-06-01', time: '20:00',
    venue: 'Wembley Stadium, London', referee: 'Szymon Marciniak', attendance: '86,935',
    stats: { possession: [46,54], shotsOnTarget: [8,5], totalShots: [14,11], corners: [5,6], fouls: [11,12], yellowCards: [2,2], redCards: [0,0], offsides: [3,2], passAccuracy: [82,88], saves: [3,4] },
    goals: [
      { minute: 12, scorer: 'Kylian Mbappé', team: 'home', type: 'goal' },
      { minute: 33, scorer: 'Harry Kane', team: 'away', type: 'goal' },
      { minute: 54, scorer: 'Vinicius Jr.', team: 'home', type: 'goal' },
      { minute: 71, scorer: 'Jude Bellingham', team: 'home', type: 'goal' },
      { minute: 78, scorer: 'Thomas Müller', team: 'away', type: 'goal' },
      { minute: 90, scorer: 'Jude Bellingham', team: 'home', type: 'penalty' },
    ],
    homeLineup: ['T. Courtois','D. Carvajal','E. Militão','A. Rüdiger','F. Mendy','Tchouaméni','E. Camavinga','J. Bellingham','F. Valverde','K. Mbappé','Vinicius Jr.'],
    awayLineup: ['M. Neuer','N. Pavard','D. Upamecano','M. de Ligt','A. Davies','J. Kimmich','L. Goretzka','L. Sané','T. Müller','J. Musiala','H. Kane'],
    homeSubs: ["Modrić 72'","Asensio 80'"],
    awaySubs: ["K. Coman 65'","S. Gnabry 75'"],
  },
  'ucl-2': {
    id: 'ucl-2', homeTeam: 'Manchester City', awayTeam: 'Inter Milan', homeScore: 3, awayScore: 1, status: 'FT',
    competition: 'UCL Semi-final 2nd Leg', league: 'Champions League', date: '2026-05-14', time: '20:00',
    venue: 'Etihad Stadium, Manchester', referee: 'Felix Zwayer', attendance: '53,400',
    stats: { possession: [60,40], shotsOnTarget: [9,3], totalShots: [18,8], corners: [9,3], fouls: [8,13], yellowCards: [1,3], redCards: [0,0], offsides: [2,1], passAccuracy: [91,80], saves: [2,6] },
    goals: [
      { minute: 28, scorer: 'Erling Haaland', team: 'home', type: 'goal' },
      { minute: 50, scorer: 'L. Martínez', team: 'away', type: 'goal' },
      { minute: 68, scorer: 'Phil Foden', team: 'home', type: 'goal' },
      { minute: 85, scorer: 'Erling Haaland', team: 'home', type: 'goal' },
    ],
    homeLineup: ['Ederson','K. Walker','R. Dias','M. Akanji','J. Gvardiol','Rodri','K. De Bruyne','B. Silva','P. Foden','J. Doku','E. Haaland'],
    awayLineup: ['Y. Sommer','M. Pavard','A. Bastoni','F. Acerbi','D. Dumfries','H. Çalhanoğlu','M. Barella','H. Mkhitaryan','F. Dimarco','L. Martínez','M. Thuram'],
    homeSubs: ["I. Gündoğan 75'","O. Bobb 82'"],
    awaySubs: ["A. Sanchez 65'","D. Frattesi 71'"],
  },
  'ucl-3': {
    id: 'ucl-3', homeTeam: 'Bayern Munich', awayTeam: 'Arsenal', homeScore: 2, awayScore: 0, status: 'FT',
    competition: 'UCL Quarter-final 2nd Leg', league: 'Champions League', date: '2026-05-10', time: '20:00',
    venue: 'Allianz Arena, Munich', referee: 'Daniele Orsato', attendance: '75,000',
    stats: { possession: [52,48], shotsOnTarget: [6,4], totalShots: [14,10], corners: [6,5], fouls: [10,11], yellowCards: [2,2], redCards: [0,0], offsides: [2,3], passAccuracy: [87,84], saves: [4,3] },
    goals: [
      { minute: 31, scorer: 'Harry Kane', team: 'home', type: 'goal' },
      { minute: 79, scorer: 'Jamal Musiala', team: 'home', type: 'goal' },
    ],
    homeLineup: ['M. Neuer','N. Pavard','M. de Ligt','D. Upamecano','A. Davies','J. Kimmich','L. Goretzka','L. Sané','T. Müller','J. Musiala','H. Kane'],
    awayLineup: ['D. Raya','B. White','W. Saliba','G. Magalhães','O. Zinchenko','T. Partey','M. Ødegaard','D. Rice','B. Saka','G. Martinelli','L. Trossard'],
    homeSubs: ["K. Coman 65'","T. Laimer 78'"],
    awaySubs: ["E. Nketiah 55'","R. Nelson 70'"],
  },
  'll-1': {
    id: 'll-1', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeScore: 3, awayScore: 1, status: 'FT',
    competition: 'La Liga – El Clásico', league: 'La Liga', date: '2026-06-05', time: '20:00',
    venue: 'Santiago Bernabéu, Madrid', referee: 'Jesús Gil Manzano', attendance: '81,044',
    stats: { possession: [48,52], shotsOnTarget: [9,4], totalShots: [18,10], corners: [6,5], fouls: [13,10], yellowCards: [3,2], redCards: [0,0], offsides: [4,1], passAccuracy: [83,91], saves: [3,6] },
    goals: [
      { minute: 23, scorer: 'Kylian Mbappé', team: 'home', type: 'goal' },
      { minute: 45, scorer: 'Pedri', team: 'away', type: 'goal' },
      { minute: 67, scorer: 'Vinicius Jr.', team: 'home', type: 'goal' },
      { minute: 87, scorer: 'Jude Bellingham', team: 'home', type: 'penalty' },
    ],
    homeLineup: ['T. Courtois','D. Carvajal','E. Militão','A. Rüdiger','F. Mendy','Tchouaméni','J. Bellingham','F. Valverde','K. Mbappé','Vinicius Jr.','R. Modrić'],
    awayLineup: ['M. ter Stegen','J. Cancelo','A. Christensen','I. Gundogan','A. Balde','P. Busquets','Pedri','Gavi','L. Yamal','R. Lewandowski','F. Torres'],
    homeSubs: ["Camavinga 68'","Asensio 78'"],
    awaySubs: ["Dembélé 60'","Ferran Torres 71'"],
  },
  'll-2': {
    id: 'll-2', homeTeam: 'Atletico Madrid', awayTeam: 'Sevilla', homeScore: 2, awayScore: 0, status: 'FT',
    competition: 'La Liga', league: 'La Liga', date: '2026-06-04', time: '18:30',
    venue: 'Cívitas Metropolitano, Madrid', referee: 'Alejandro Hernández', attendance: '68,000',
    stats: { possession: [52,48], shotsOnTarget: [6,2], totalShots: [13,8], corners: [7,4], fouls: [12,10], yellowCards: [2,3], redCards: [0,0], offsides: [2,1], passAccuracy: [85,80], saves: [2,4] },
    goals: [
      { minute: 35, scorer: 'A. Griezmann', team: 'home', type: 'goal' },
      { minute: 62, scorer: 'J. Álvarez', team: 'home', type: 'goal' },
    ],
    homeLineup: ['J. Oblak','M. Hermoso','J. Giménez','R. de Paul','N. Molina','A. Witsel','K. Llorente','S. Barrios','A. Griezmann','J. Álvarez','Á. Correa'],
    awayLineup: ['Y. Bounou','J. Navas','M. Gudelj','A. Badé','M. Acuña','J. Rakitić','F. Soumaré','I. Romero','L. Ocampos','Y. En-Nesyri','A. Suso'],
    homeSubs: ["M. Lino 70'","C. Azpilicueta 80'"],
    awaySubs: ["O. Lamela 65'","G. Mir 72'"],
  },
  'll-3': {
    id: 'll-3', homeTeam: 'Barcelona', awayTeam: 'Athletic Club', homeScore: 2, awayScore: 2, status: 'FT',
    competition: 'La Liga', league: 'La Liga', date: '2026-06-02', time: '20:00',
    venue: 'Camp Nou, Barcelona', referee: 'Ricardo de Burgos', attendance: '79,500',
    stats: { possession: [58,42], shotsOnTarget: [7,5], totalShots: [16,12], corners: [8,5], fouls: [11,13], yellowCards: [2,3], redCards: [0,0], offsides: [3,2], passAccuracy: [90,81], saves: [3,4] },
    goals: [
      { minute: 15, scorer: 'L. Yamal', team: 'home', type: 'goal' },
      { minute: 40, scorer: 'I. Williams', team: 'away', type: 'goal' },
      { minute: 65, scorer: 'R. Lewandowski', team: 'home', type: 'goal' },
      { minute: 90, scorer: 'O. Sancet', team: 'away', type: 'goal' },
    ],
    homeLineup: ['M. ter Stegen','J. Cancelo','A. Christensen','R. Araújo','A. Balde','Pedri','Gavi','D. Olmo','L. Yamal','R. Lewandowski','R. Torres'],
    awayLineup: ['U. Simón','Capa','D. Vivian','Y. Yeray','J. Berchiche','D. García','M. Vesga','O. Sancet','I. Williams','N. Williams','G. Aduriz'],
    homeSubs: ["F. Torres 65'","P. Gavi 78'"],
    awaySubs: ["M. Berenguer 71'","L. Unai 82'"],
  },
  'sa-1': {
    id: 'sa-1', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', homeScore: 2, awayScore: 1, status: 'FT',
    competition: 'Serie A – Derby della Madonnina', league: 'Serie A', date: '2026-06-06', time: '20:45',
    venue: 'San Siro, Milan', referee: 'Daniele Orsato', attendance: '75,817',
    stats: { possession: [53,47], shotsOnTarget: [6,5], totalShots: [14,11], corners: [7,4], fouls: [10,13], yellowCards: [2,3], redCards: [0,0], offsides: [2,4], passAccuracy: [88,84], saves: [4,4] },
    goals: [
      { minute: 29, scorer: 'L. Martínez', team: 'home', type: 'goal' },
      { minute: 51, scorer: 'R. Leão', team: 'away', type: 'goal' },
      { minute: 76, scorer: 'H. Çalhanoğlu', team: 'home', type: 'penalty' },
    ],
    homeLineup: ['Y. Sommer','M. Pavard','A. Bastoni','F. Acerbi','D. Dumfries','H. Çalhanoğlu','M. Barella','H. Mkhitaryan','F. Dimarco','L. Martínez','M. Thuram'],
    awayLineup: ['M. Maignan','D. Calabria','F. Tomori','T. Hernández','Y. Koné','Y. Bennacer','T. Reijnders','C. Pulisic','R. Leão','L. Jović','S. Giroud'],
    homeSubs: ["A. Sanchez 70'","R. De Vrij 82'"],
    awaySubs: ["M. Chukwueze 60'","A. Florenzi 75'"],
  },
  'sa-2': {
    id: 'sa-2', homeTeam: 'Juventus', awayTeam: 'Napoli', homeScore: 1, awayScore: 1, status: 'FT',
    competition: 'Serie A', league: 'Serie A', date: '2026-06-05', time: '20:45',
    venue: 'Allianz Stadium, Turin', referee: 'Paolo Valeri', attendance: '40,200',
    stats: { possession: [49,51], shotsOnTarget: [4,5], totalShots: [12,13], corners: [5,6], fouls: [13,11], yellowCards: [3,2], redCards: [0,0], offsides: [2,3], passAccuracy: [84,86], saves: [4,3] },
    goals: [
      { minute: 42, scorer: 'D. Vlahović', team: 'home', type: 'goal' },
      { minute: 68, scorer: 'V. Osimhen', team: 'away', type: 'penalty' },
    ],
    homeLineup: ['W. Szczęsny','D. Danilo','L. Bonucci','M. Bremer','F. Kostic','A. Rabiot','M. Locatelli','F. Chiesa','A. Di María','D. Vlahović','K. Weah'],
    awayLineup: ['A. Meret','G. Di Lorenzo','A. Rrahmani','M. Ostigard','M. Olivera','S. Lobotka','P. Zielinski','H. Politano','K. Kvaratskhelia','V. Osimhen','E. Elmas'],
    homeSubs: ["M. Miretti 65'","A. Gatti 78'"],
    awaySubs: ["R. Raspadori 71'","G. Gaetano 80'"],
  },
  'sa-3': {
    id: 'sa-3', homeTeam: 'AC Milan', awayTeam: 'AS Roma', homeScore: 3, awayScore: 0, status: 'FT',
    competition: 'Serie A', league: 'Serie A', date: '2026-06-03', time: '18:00',
    venue: 'San Siro, Milan', referee: 'Marco Piccinini', attendance: '70,300',
    stats: { possession: [55,45], shotsOnTarget: [8,2], totalShots: [16,8], corners: [8,4], fouls: [9,12], yellowCards: [1,3], redCards: [0,0], offsides: [3,1], passAccuracy: [87,83], saves: [2,5] },
    goals: [
      { minute: 19, scorer: 'C. Pulisic', team: 'home', type: 'goal' },
      { minute: 55, scorer: 'R. Leão', team: 'home', type: 'goal' },
      { minute: 80, scorer: 'L. Jović', team: 'home', type: 'goal' },
    ],
    homeLineup: ['M. Maignan','D. Calabria','F. Tomori','T. Hernández','Y. Koné','Y. Bennacer','T. Reijnders','C. Pulisic','R. Leão','L. Jović','O. Giroud'],
    awayLineup: ['R. Patricio','R. Karsdorp','G. Mancini','C. Smalling','L. Spinazzola','L. Paredes','L. Pellegrini','P. Dybala','H. Zaniolo','T. Abraham','E. Dybala'],
    homeSubs: ["M. Chukwueze 70'","A. Florenzi 80'"],
    awaySubs: ["A. Belotti 55'","B. El Shaarawy 65'"],
  },
  'nl-1': {
    id: 'nl-1', homeTeam: '🇫🇷 France', awayTeam: '🇵🇹 Portugal', homeScore: 3, awayScore: 2, status: 'FT',
    competition: 'UEFA Nations League', league: 'Nations League', date: '2026-06-08', time: '20:45',
    venue: 'Stade de France, Paris', homeFlag: '🇫🇷', awayFlag: '🇵🇹',
    referee: 'Anthony Taylor', attendance: '79,824',
    stats: { possession: [52,48], shotsOnTarget: [8,7], totalShots: [15,14], corners: [6,5], fouls: [12,10], yellowCards: [2,3], redCards: [0,0], offsides: [2,3], passAccuracy: [87,85], saves: [5,5] },
    goals: [
      { minute: 8, scorer: 'Kylian Mbappé', team: 'home', type: 'goal' },
      { minute: 27, scorer: 'Cristiano Ronaldo', team: 'away', type: 'penalty' },
      { minute: 55, scorer: 'Antoine Griezmann', team: 'home', type: 'goal' },
      { minute: 68, scorer: 'Diogo Jota', team: 'away', type: 'goal' },
      { minute: 82, scorer: 'Ousmane Dembélé', team: 'home', type: 'goal' },
    ],
    homeLineup: ['M. Maignan','B. Pavard','D. Upamecano','W. Saliba','T. Hernandez','Y. Camavinga','A. Tchouaméni','K. Mbappé','A. Griezmann','O. Dembélé','M. Thuram'],
    awayLineup: ['D. Costa','J. Cancelo','R. Dias','D. Dalot','N. Mendes','B. Silva','Vitinha','R. Neves','B. Fernandes','D. Jota','C. Ronaldo'],
    homeSubs: ["O. Giroud 71'","B. Digne 80'"],
    awaySubs: ["F. Torres 65'","João Félix 75'"],
  },
  'nl-2': {
    id: 'nl-2', homeTeam: '🇪🇸 Spain', awayTeam: '🇩🇪 Germany', homeScore: 2, awayScore: 0, status: 'FT',
    competition: 'UEFA Nations League', league: 'Nations League', date: '2026-06-06', time: '20:45',
    venue: 'Estadio de La Cartuja, Seville', homeFlag: '🇪🇸', awayFlag: '🇩🇪',
    referee: 'Felix Brych', attendance: '57,000',
    stats: { possession: [60,40], shotsOnTarget: [7,3], totalShots: [15,9], corners: [7,3], fouls: [8,12], yellowCards: [1,2], redCards: [0,0], offsides: [2,1], passAccuracy: [92,84], saves: [3,5] },
    goals: [
      { minute: 34, scorer: 'Álvaro Morata', team: 'home', type: 'goal' },
      { minute: 77, scorer: 'Ferran Torres', team: 'home', type: 'goal' },
    ],
    homeLineup: ['U. Simón','C. Azpilicueta','A. Laporte','P. Torres','J. Gayà','Pedri','R. Rodri','G. Gavi','D. Olmo','A. Morata','F. Torres'],
    awayLineup: ['M. Neuer','T. Müller','A. Rüdiger','M. Schlotterbeck','D. Raum','J. Kimmich','L. Goretzka','J. Musiala','K. Gnabry','K. Havertz','T. Werner'],
    homeSubs: ["M. Asensio 65'","A. Mikel Merino 75'"],
    awaySubs: ["K. Coman 55'","F. Wirtz 68'"],
  },
  'nl-3': {
    id: 'nl-3', homeTeam: '🇳🇱 Netherlands', awayTeam: '🇩🇪 Germany', homeScore: 1, awayScore: 1, status: 'FT',
    competition: 'UEFA Nations League', league: 'Nations League', date: '2026-06-04', time: '20:45',
    venue: 'Johan Cruyff Arena, Amsterdam', homeFlag: '🇳🇱', awayFlag: '🇩🇪',
    referee: 'István Kovács', attendance: '52,500',
    stats: { possession: [48,52], shotsOnTarget: [5,6], totalShots: [13,14], corners: [5,7], fouls: [11,10], yellowCards: [2,2], redCards: [0,0], offsides: [3,2], passAccuracy: [83,87], saves: [5,4] },
    goals: [
      { minute: 44, scorer: 'M. Depay', team: 'home', type: 'goal' },
      { minute: 71, scorer: 'K. Havertz', team: 'away', type: 'goal' },
    ],
    homeLineup: ['B. Flekken','D. Dumfries','V. van Dijk','S. de Vrij','N. Ake','F. de Jong','T. Reijnders','X. Simons','S. Bergwijn','M. Depay','C. Gakpo'],
    awayLineup: ['M. Neuer','T. Müller','A. Rüdiger','J. Tah','D. Raum','J. Kimmich','L. Goretzka','J. Musiala','F. Wirtz','K. Havertz','L. Sané'],
    homeSubs: ["D. Blind 65'","K. Timber 78'"],
    awaySubs: ["J. Brandt 60'","N. Fullkrug 72'"],
  },
  'wc-1': {
    id: 'wc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇦🇷 Argentina', homeScore: 3, awayScore: 1, status: 'FT',
    competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-10', time: '22:00',
    venue: 'MetLife Stadium, New York', homeFlag: '🇧🇷', awayFlag: '🇦🇷',
    referee: 'Clément Turpin', attendance: '82,500',
    stats: { possession: [55,45], shotsOnTarget: [9,4], totalShots: [17,9], corners: [8,3], fouls: [10,15], yellowCards: [2,4], redCards: [0,1], offsides: [1,3], passAccuracy: [88,82], saves: [3,6] },
    goals: [
      { minute: 15, scorer: 'Vinícius Jr.', team: 'home', type: 'goal' },
      { minute: 44, scorer: 'L. Messi', team: 'away', type: 'penalty' },
      { minute: 58, scorer: 'Rodrygo', team: 'home', type: 'goal' },
      { minute: 79, scorer: 'Endrick', team: 'home', type: 'goal' },
    ],
    homeLineup: ['Alisson','D. Alves','Marquinhos','Gabriel Magalhães','Guilherme Arana','Casemiro','L. Paquetá','R. Guimarães','Rodrygo','Vinícius Jr.','Endrick'],
    awayLineup: ['E. Martínez','N. Molina','L. Martínez','C. Romero','N. Tagliafico','R. De Paul','E. Fernández','A. Mac Allister','J. Álvarez','A. Di María','L. Messi'],
    homeSubs: ["Gabriel Jesus 68'","Éder Militão 75'"],
    awaySubs: ["P. Dybala 65'","L. Ocampos 77'"],
  },
  'wc-2': {
    id: 'wc-2', homeTeam: '🇫🇷 France', awayTeam: '🇩🇪 Germany', homeScore: 2, awayScore: 2, status: 'FT',
    competition: 'FIFA World Cup – Group A', league: 'FIFA World Cup', date: '2026-06-09', time: '22:00',
    venue: 'SoFi Stadium, Los Angeles', homeFlag: '🇫🇷', awayFlag: '🇩🇪',
    referee: 'Björn Kuipers', attendance: '70,400',
    stats: { possession: [50,50], shotsOnTarget: [7,6], totalShots: [14,13], corners: [6,6], fouls: [11,11], yellowCards: [2,2], redCards: [0,0], offsides: [2,2], passAccuracy: [86,86], saves: [4,5] },
    goals: [
      { minute: 22, scorer: 'Kylian Mbappé', team: 'home', type: 'goal' },
      { minute: 38, scorer: 'T. Müller', team: 'away', type: 'goal' },
      { minute: 61, scorer: 'J. Musiala', team: 'away', type: 'goal' },
      { minute: 85, scorer: 'A. Griezmann', team: 'home', type: 'goal' },
    ],
    homeLineup: ['M. Maignan','B. Pavard','D. Upamecano','W. Saliba','T. Hernandez','A. Tchouaméni','Y. Camavinga','K. Mbappé','A. Griezmann','O. Dembélé','M. Thuram'],
    awayLineup: ['M. Neuer','T. Müller','A. Rüdiger','N. Schlotterbeck','D. Raum','J. Kimmich','L. Goretzka','J. Musiala','F. Wirtz','K. Gnabry','K. Havertz'],
    homeSubs: ["O. Giroud 70'","N. Zaire-Emery 79'"],
    awaySubs: ["L. Sané 60'","R. Hoffmann 75'"],
  },
  'wc-3': {
    id: 'wc-3', homeTeam: '🇵🇹 Portugal', awayTeam: '🇯🇵 Japan', homeScore: 4, awayScore: 0, status: 'FT',
    competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-07', time: '19:00',
    venue: 'Rose Bowl, Los Angeles', homeFlag: '🇵🇹', awayFlag: '🇯🇵',
    referee: 'Stéphanie Frappart', attendance: '91,100',
    stats: { possession: [63,37], shotsOnTarget: [10,2], totalShots: [20,6], corners: [10,2], fouls: [7,11], yellowCards: [1,2], redCards: [0,0], offsides: [3,1], passAccuracy: [91,76], saves: [2,6] },
    goals: [
      { minute: 11, scorer: 'Cristiano Ronaldo', team: 'home', type: 'goal' },
      { minute: 33, scorer: 'Bruno Fernandes', team: 'home', type: 'goal' },
      { minute: 64, scorer: 'Diogo Jota', team: 'home', type: 'goal' },
      { minute: 88, scorer: 'Cristiano Ronaldo', team: 'home', type: 'penalty' },
    ],
    homeLineup: ['D. Costa','J. Cancelo','R. Dias','D. Dalot','N. Mendes','B. Silva','Vitinha','R. Neves','B. Fernandes','D. Jota','C. Ronaldo'],
    awayLineup: ['S. Gonda','H. Sakai','M. Yoshida','K. Itakura','Y. Nagatomo','J. Endo','G. Doan','R. Kamada','R. Tomiyasu','K. Mitoma','D. Ueda'],
    homeSubs: ["João Félix 65'","P. Horta 72'"],
    awaySubs: ["R. Suzuki 55'","K. Furuhashi 65'"],
  },
  'spl-1': {
    id: 'spl-1', homeTeam: 'Arsenal', awayTeam: 'Manchester City', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-14', time: '16:30',
    venue: 'Emirates Stadium, London', referee: 'TBD', attendance: 'TBD',
  },
  'spl-2': {
    id: 'spl-2', homeTeam: 'Liverpool', awayTeam: 'Tottenham', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-16', time: '14:00',
    venue: 'Anfield, Liverpool', referee: 'TBD', attendance: 'TBD',
  },
  'spl-3': {
    id: 'spl-3', homeTeam: 'Chelsea', awayTeam: 'Aston Villa', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Premier League', league: 'Premier League', date: '2026-06-18', time: '14:00',
    venue: 'Stamford Bridge, London', referee: 'TBD', attendance: 'TBD',
  },
  'sll-1': {
    id: 'sll-1', homeTeam: 'Barcelona', awayTeam: 'Real Madrid', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'La Liga – El Clásico', league: 'La Liga', date: '2026-06-15', time: '20:00',
    venue: 'Camp Nou, Barcelona', referee: 'TBD', attendance: 'TBD',
  },
  'sll-2': {
    id: 'sll-2', homeTeam: 'Atletico Madrid', awayTeam: 'Real Sociedad', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'La Liga', league: 'La Liga', date: '2026-06-17', time: '18:30',
    venue: 'Cívitas Metropolitano, Madrid', referee: 'TBD', attendance: 'TBD',
  },
  'snl-1': {
    id: 'snl-1', homeTeam: '🇫🇷 France', awayTeam: '🇩🇪 Germany', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Nations League', league: 'Nations League', date: '2026-06-18', time: '20:45',
    venue: 'Stade de France, Paris', homeFlag: '🇫🇷', awayFlag: '🇩🇪', referee: 'TBD', attendance: 'TBD',
  },
  'snl-2': {
    id: 'snl-2', homeTeam: '🇪🇸 Spain', awayTeam: '🇵🇹 Portugal', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Nations League', league: 'Nations League', date: '2026-06-20', time: '20:45',
    venue: 'Santiago Bernabéu, Madrid', homeFlag: '🇪🇸', awayFlag: '🇵🇹', referee: 'TBD', attendance: 'TBD',
  },
  'ssa-1': {
    id: 'ssa-1', homeTeam: 'Inter Milan', awayTeam: 'Juventus', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Serie A', league: 'Serie A', date: '2026-06-19', time: '20:45',
    venue: 'San Siro, Milan', referee: 'TBD', attendance: 'TBD',
  },
  'ssa-2': {
    id: 'ssa-2', homeTeam: 'AC Milan', awayTeam: 'Napoli', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'Serie A', league: 'Serie A', date: '2026-06-21', time: '18:00',
    venue: 'San Siro, Milan', referee: 'TBD', attendance: 'TBD',
  },
  'swc-1': {
    id: 'swc-1', homeTeam: '🇧🇷 Brazil', awayTeam: '🇵🇹 Portugal', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-22', time: '22:00',
    venue: 'AT&T Stadium, Dallas', homeFlag: '🇧🇷', awayFlag: '🇵🇹', referee: 'TBD', attendance: 'TBD',
  },
  'swc-2': {
    id: 'swc-2', homeTeam: '🇦🇷 Argentina', awayTeam: '🇯🇵 Japan', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'FIFA World Cup – Group C', league: 'FIFA World Cup', date: '2026-06-24', time: '19:00',
    venue: 'Rose Bowl, Los Angeles', homeFlag: '🇦🇷', awayFlag: '🇯🇵', referee: 'TBD', attendance: 'TBD',
  },
  'sucl-1': {
    id: 'sucl-1', homeTeam: 'Real Madrid', awayTeam: 'Arsenal', homeScore: null, awayScore: null, status: 'Upcoming',
    competition: 'UCL Qualifying', league: 'Champions League', date: '2026-07-30', time: '20:00',
    venue: 'Wembley Stadium, London', referee: 'TBD', attendance: 'TBD',
  },
}

export const footballPlayerDetails: FootballPlayerDetail[] = [
  { id: 1, name: 'Erling Haaland', team: 'Manchester City', league: 'Premier League', position: 'ST', age: 23, nationality: 'Norway', flag: '🇳🇴', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/276520.png', jersey: 9, appearances: 34, goals: 32, assists: 8, minutesPlayed: 2890, passAccuracy: 72, shotsPerGame: 3.2, keyPasses: 0.8, dribbles: 0.6, tackles: 0.4, interceptions: 0.2, yellowCards: 3, redCards: 0, rating: 8.7 },
  { id: 2, name: 'Kylian Mbappé', team: 'Real Madrid', league: 'La Liga', position: 'ST', age: 25, nationality: 'France', flag: '🇫🇷', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/220497.png', jersey: 9, appearances: 32, goals: 28, assists: 12, minutesPlayed: 2680, passAccuracy: 80, shotsPerGame: 3.8, keyPasses: 1.5, dribbles: 3.2, tackles: 0.6, interceptions: 0.4, yellowCards: 2, redCards: 0, rating: 8.9 },
  { id: 3, name: 'Bukayo Saka', team: 'Arsenal', league: 'Premier League', position: 'RW', age: 22, nationality: 'England', flag: '🇬🇧', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/345886.png', jersey: 7, appearances: 33, goals: 16, assists: 14, minutesPlayed: 2810, passAccuracy: 82, shotsPerGame: 2.2, keyPasses: 2.4, dribbles: 2.8, tackles: 1.1, interceptions: 0.8, yellowCards: 4, redCards: 0, rating: 8.3 },
  { id: 4, name: 'Vinicius Jr.', team: 'Real Madrid', league: 'La Liga', position: 'LW', age: 23, nationality: 'Brazil', flag: '🇧🇷', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/382399.png', jersey: 7, appearances: 30, goals: 24, assists: 10, minutesPlayed: 2450, passAccuracy: 78, shotsPerGame: 2.8, keyPasses: 1.8, dribbles: 4.2, tackles: 0.5, interceptions: 0.3, yellowCards: 6, redCards: 0, rating: 8.8 },
  { id: 5, name: 'Mohamed Salah', team: 'Liverpool', league: 'Premier League', position: 'RW', age: 32, nationality: 'Egypt', flag: '🇪🇬', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/118748.png', jersey: 11, appearances: 34, goals: 24, assists: 11, minutesPlayed: 2780, passAccuracy: 81, shotsPerGame: 3.1, keyPasses: 1.9, dribbles: 2.2, tackles: 0.9, interceptions: 0.6, yellowCards: 1, redCards: 0, rating: 8.4 },
  { id: 6, name: 'Jude Bellingham', team: 'Real Madrid', league: 'La Liga', position: 'CM', age: 20, nationality: 'England', flag: '🇬🇧', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/424677.png', jersey: 5, appearances: 31, goals: 22, assists: 8, minutesPlayed: 2590, passAccuracy: 85, shotsPerGame: 2.5, keyPasses: 2.2, dribbles: 2.0, tackles: 2.1, interceptions: 1.2, yellowCards: 5, redCards: 0, rating: 8.6 },
  { id: 7, name: 'Phil Foden', team: 'Manchester City', league: 'Premier League', position: 'AM', age: 24, nationality: 'England', flag: '🇬🇧', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/289659.png', jersey: 47, appearances: 32, goals: 15, assists: 11, minutesPlayed: 2540, passAccuracy: 86, shotsPerGame: 2.1, keyPasses: 2.8, dribbles: 2.5, tackles: 1.0, interceptions: 0.7, yellowCards: 3, redCards: 0, rating: 8.1 },
  { id: 8, name: 'Pedri', team: 'Barcelona', league: 'La Liga', position: 'CM', age: 22, nationality: 'Spain', flag: '🇪🇸', image: 'https://a.espncdn.com/i/headshots/soccer/players/full/698856.png', jersey: 8, appearances: 30, goals: 9, assists: 12, minutesPlayed: 2340, passAccuracy: 90, shotsPerGame: 1.6, keyPasses: 3.1, dribbles: 3.4, tackles: 1.8, interceptions: 1.4, yellowCards: 4, redCards: 0, rating: 8.2 },
]
