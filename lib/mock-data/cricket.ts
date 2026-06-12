export type FormResult = 'W' | 'L' | 'D'
export type CricketZoneType = 'qualifier' | 'eliminated' | ''

export interface CricketStanding {
  pos: number
  team: string
  played: number
  won: number
  lost: number
  nrr: string
  points: number
  form: FormResult[]
  zone: CricketZoneType
}

export interface CricketMatch {
  id: string
  competition: string
  homeTeam: string
  awayTeam: string
  homeScore: string | null
  awayScore: string | null
  winner: 'home' | 'away' | null
  status: 'FT' | 'Live' | 'Upcoming'
  date: string
  time: string
  venue: string
  result?: string
}

export interface CricketPlayerDetail {
  id: number
  name: string
  team: string
  nationality: string
  flag: string
  role: string
  age: number
  jersey: number
  image: string
  league: string
  rating: number
  runs: number
  matches: number
  innings: number
  average: number
  strikeRate: number
  fifties: number
  hundreds: number
  wickets: number
  economy: number
  bowlingAvg: number
  fiveWickets: number
  catches: number
}

export const CRICKET_LEAGUES = [
  { id: 'all',     name: 'All',    logo: null,       emoji: '🏏' },
  { id: 'ICC T20', name: 'ICC T20', logo: '/icc.png', emoji: '🌍' },
  { id: 'IPL',     name: 'IPL',    logo: '/ipl.png', emoji: '🇮🇳' },
  { id: 'PSL',     name: 'PSL',    logo: '/psl.png', emoji: '🇵🇰' },
  { id: 'BBL',     name: 'BBL',    logo: '/bbl.png', emoji: '🇦🇺' },
]

export const cricketStandings: Record<string, CricketStanding[]> = {
  'IPL': [
    { pos: 1,  team: 'Mumbai Indians',               played: 14, won: 10, lost: 3,  nrr: '+1.24', points: 21, form: ['W','W','W','L','W'], zone: 'qualifier' },
    { pos: 2,  team: 'Chennai Super Kings',          played: 14, won: 9,  lost: 4,  nrr: '+0.56', points: 19, form: ['W','W','L','W','W'], zone: 'qualifier' },
    { pos: 3,  team: 'Kolkata Knight Riders',        played: 14, won: 8,  lost: 5,  nrr: '+0.31', points: 17, form: ['W','L','W','W','L'], zone: 'qualifier' },
    { pos: 4,  team: 'Royal Challengers Bengaluru',  played: 14, won: 8,  lost: 6,  nrr: '+0.12', points: 16, form: ['W','W','L','W','L'], zone: 'qualifier' },
    { pos: 5,  team: 'Rajasthan Royals',             played: 14, won: 7,  lost: 7,  nrr: '-0.15', points: 14, form: ['L','W','W','L','W'], zone: '' },
    { pos: 6,  team: 'Sunrisers Hyderabad',          played: 14, won: 6,  lost: 7,  nrr: '-0.28', points: 13, form: ['W','L','L','W','L'], zone: '' },
    { pos: 7,  team: 'Delhi Capitals',               played: 14, won: 5,  lost: 9,  nrr: '-0.44', points: 10, form: ['L','L','W','L','L'], zone: 'eliminated' },
    { pos: 8,  team: 'Punjab Kings',                 played: 14, won: 5,  lost: 9,  nrr: '-0.67', points: 10, form: ['L','W','L','L','L'], zone: 'eliminated' },
    { pos: 9,  team: 'Gujarat Titans',               played: 14, won: 4,  lost: 10, nrr: '-0.78', points: 8,  form: ['L','L','L','W','L'], zone: 'eliminated' },
    { pos: 10, team: 'Lucknow Super Giants',         played: 14, won: 3,  lost: 11, nrr: '-1.21', points: 6,  form: ['L','L','L','L','W'], zone: 'eliminated' },
  ],
  'PSL': [
    { pos: 1, team: 'Peshawar Zalmi',    played: 10, won: 7, lost: 3, nrr: '+0.91', points: 14, form: ['W','W','L','W','W'], zone: 'qualifier' },
    { pos: 2, team: 'Lahore Qalandars',  played: 10, won: 6, lost: 4, nrr: '+0.43', points: 12, form: ['W','L','W','W','L'], zone: 'qualifier' },
    { pos: 3, team: 'Islamabad United',  played: 10, won: 6, lost: 4, nrr: '+0.21', points: 12, form: ['L','W','W','L','W'], zone: 'qualifier' },
    { pos: 4, team: 'Karachi Kings',     played: 10, won: 5, lost: 5, nrr: '-0.12', points: 10, form: ['W','W','L','L','W'], zone: 'qualifier' },
    { pos: 5, team: 'Quetta Gladiators', played: 10, won: 4, lost: 6, nrr: '-0.34', points: 8,  form: ['L','W','L','L','L'], zone: 'eliminated' },
    { pos: 6, team: 'Multan Sultans',    played: 10, won: 2, lost: 8, nrr: '-1.18', points: 4,  form: ['L','L','L','W','L'], zone: 'eliminated' },
  ],
  'ICC T20': [
    { pos: 1, team: '🇮🇳 India',        played: 5, won: 5, lost: 0, nrr: '+2.14', points: 10, form: ['W','W','W','W','W'], zone: 'qualifier' },
    { pos: 2, team: '🇦🇺 Australia',    played: 5, won: 4, lost: 1, nrr: '+1.21', points: 8,  form: ['W','W','L','W','W'], zone: 'qualifier' },
    { pos: 3, team: '🇬🇧 England',      played: 5, won: 3, lost: 2, nrr: '+0.56', points: 6,  form: ['W','L','W','W','L'], zone: 'qualifier' },
    { pos: 4, team: '🇿🇦 South Africa', played: 5, won: 3, lost: 2, nrr: '+0.12', points: 6,  form: ['W','W','L','L','W'], zone: 'qualifier' },
    { pos: 5, team: '🇳🇿 New Zealand',  played: 5, won: 2, lost: 3, nrr: '-0.34', points: 4,  form: ['L','W','W','L','L'], zone: '' },
    { pos: 6, team: '🇵🇰 Pakistan',     played: 5, won: 2, lost: 3, nrr: '-0.78', points: 4,  form: ['L','L','W','L','W'], zone: '' },
    { pos: 7, team: '🇧🇩 Bangladesh',   played: 5, won: 1, lost: 4, nrr: '-1.23', points: 2,  form: ['L','L','L','W','L'], zone: 'eliminated' },
    { pos: 8, team: '🇱🇰 Sri Lanka',    played: 5, won: 0, lost: 5, nrr: '-2.45', points: 0,  form: ['L','L','L','L','L'], zone: 'eliminated' },
  ],
  'BBL': [
    { pos: 1, team: 'Sydney Sixers',       played: 12, won: 9, lost: 3,  nrr: '+1.12', points: 18, form: ['W','W','W','L','W'], zone: 'qualifier' },
    { pos: 2, team: 'Perth Scorchers',     played: 12, won: 8, lost: 4,  nrr: '+0.67', points: 16, form: ['W','W','L','W','W'], zone: 'qualifier' },
    { pos: 3, team: 'Melbourne Stars',     played: 12, won: 7, lost: 5,  nrr: '+0.23', points: 14, form: ['L','W','W','W','L'], zone: 'qualifier' },
    { pos: 4, team: 'Brisbane Heat',       played: 12, won: 6, lost: 6,  nrr: '-0.11', points: 12, form: ['W','L','W','L','W'], zone: 'qualifier' },
    { pos: 5, team: 'Melbourne Renegades', played: 12, won: 5, lost: 7,  nrr: '-0.45', points: 10, form: ['L','W','L','L','W'], zone: 'eliminated' },
    { pos: 6, team: 'Adelaide Strikers',   played: 12, won: 4, lost: 8,  nrr: '-0.67', points: 8,  form: ['L','L','W','L','L'], zone: 'eliminated' },
    { pos: 7, team: 'Hobart Hurricanes',   played: 12, won: 3, lost: 9,  nrr: '-0.89', points: 6,  form: ['L','L','L','W','L'], zone: 'eliminated' },
    { pos: 8, team: 'Sydney Thunder',      played: 12, won: 2, lost: 10, nrr: '-1.34', points: 4,  form: ['L','L','L','L','W'], zone: 'eliminated' },
  ],
}
cricketStandings['all'] = cricketStandings['IPL']

export const cricketScores: Record<string, CricketMatch[]> = {
  'IPL': [
    { id: 'ipl-s1', competition: 'IPL 2025', homeTeam: 'Mumbai Indians', awayTeam: 'Chennai Super Kings', homeScore: '187/6', awayScore: '183/8', winner: 'home', status: 'FT', date: '2026-06-08', time: '19:30', venue: 'Wankhede Stadium, Mumbai', result: 'Mumbai Indians won by 4 runs' },
    { id: 'ipl-s2', competition: 'IPL 2025', homeTeam: 'Kolkata Knight Riders', awayTeam: 'Royal Challengers Bengaluru', homeScore: '195/5', awayScore: '190/8', winner: 'home', status: 'FT', date: '2026-06-07', time: '15:30', venue: 'Eden Gardens, Kolkata', result: 'KKR won by 5 runs' },
    { id: 'ipl-s3', competition: 'IPL 2025', homeTeam: 'Rajasthan Royals', awayTeam: 'Sunrisers Hyderabad', homeScore: '175/7', awayScore: '178/4', winner: 'away', status: 'FT', date: '2026-06-06', time: '19:30', venue: 'Sawai Mansingh Stadium, Jaipur', result: 'SRH won by 6 wickets' },
    { id: 'ipl-s4', competition: 'IPL 2025', homeTeam: 'Delhi Capitals', awayTeam: 'Punjab Kings', homeScore: '166/8', awayScore: '168/6', winner: 'away', status: 'FT', date: '2026-06-05', time: '19:30', venue: 'Arun Jaitley Stadium, Delhi', result: 'PBKS won by 4 wickets' },
  ],
  'PSL': [
    { id: 'psl-s1', competition: 'PSL 2025', homeTeam: 'Peshawar Zalmi', awayTeam: 'Lahore Qalandars', homeScore: '162/8', awayScore: '158/9', winner: 'home', status: 'FT', date: '2026-06-08', time: '19:00', venue: 'Arbab Niaz Stadium, Peshawar', result: 'Peshawar Zalmi won by 4 runs' },
    { id: 'psl-s2', competition: 'PSL 2025', homeTeam: 'Islamabad United', awayTeam: 'Karachi Kings', homeScore: '177/6', awayScore: '171/8', winner: 'home', status: 'FT', date: '2026-06-07', time: '19:00', venue: 'National Stadium, Karachi', result: 'Islamabad United won by 6 runs' },
    { id: 'psl-s3', competition: 'PSL 2025', homeTeam: 'Multan Sultans', awayTeam: 'Quetta Gladiators', homeScore: '148/9', awayScore: '152/7', winner: 'away', status: 'FT', date: '2026-06-06', time: '19:00', venue: 'Multan Cricket Stadium', result: 'Quetta Gladiators won by 3 wickets' },
  ],
  'ICC T20': [
    { id: 'icc-s1', competition: 'ICC T20 World Cup', homeTeam: '🇮🇳 India', awayTeam: '🇦🇺 Australia', homeScore: '196/4', awayScore: '172/8', winner: 'home', status: 'FT', date: '2026-06-08', time: '10:00', venue: 'Nassau County Stadium, New York', result: 'India won by 24 runs' },
    { id: 'icc-s2', competition: 'ICC T20 World Cup', homeTeam: '🇬🇧 England', awayTeam: '🇿🇦 South Africa', homeScore: '183/6', awayScore: '179/7', winner: 'home', status: 'FT', date: '2026-06-07', time: '10:00', venue: 'Kensington Oval, Barbados', result: 'England won by 4 runs' },
    { id: 'icc-s3', competition: 'ICC T20 World Cup', homeTeam: '🇵🇰 Pakistan', awayTeam: '🇳🇿 New Zealand', homeScore: '158/8', awayScore: '162/5', winner: 'away', status: 'FT', date: '2026-06-06', time: '14:00', venue: 'Brian Lara Stadium, Trinidad', result: 'New Zealand won by 5 wickets' },
  ],
  'BBL': [
    { id: 'bbl-s1', competition: 'BBL 2025/26', homeTeam: 'Sydney Sixers', awayTeam: 'Perth Scorchers', homeScore: '189/6', awayScore: '185/7', winner: 'home', status: 'FT', date: '2026-06-08', time: '19:00', venue: 'Sydney Cricket Ground', result: 'Sydney Sixers won by 4 runs' },
    { id: 'bbl-s2', competition: 'BBL 2025/26', homeTeam: 'Melbourne Stars', awayTeam: 'Brisbane Heat', homeScore: '176/4', awayScore: '170/9', winner: 'home', status: 'FT', date: '2026-06-07', time: '19:00', venue: 'Melbourne Cricket Ground', result: 'Melbourne Stars won by 6 runs' },
    { id: 'bbl-s3', competition: 'BBL 2025/26', homeTeam: 'Adelaide Strikers', awayTeam: 'Hobart Hurricanes', homeScore: '155/8', awayScore: '158/6', winner: 'away', status: 'FT', date: '2026-06-06', time: '19:30', venue: 'Adelaide Oval', result: 'Hobart Hurricanes won by 4 wickets' },
  ],
}
cricketScores['all'] = [
  ...cricketScores['IPL'].slice(0, 2),
  ...cricketScores['PSL'].slice(0, 1),
  ...cricketScores['ICC T20'].slice(0, 2),
  ...cricketScores['BBL'].slice(0, 2),
]

export const cricketSchedule: Record<string, CricketMatch[]> = {
  'IPL': [
    { id: 'ipl-sc1', competition: 'IPL 2025', homeTeam: 'Mumbai Indians', awayTeam: 'Rajasthan Royals', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-14', time: '19:30', venue: 'Wankhede Stadium, Mumbai' },
    { id: 'ipl-sc2', competition: 'IPL 2025', homeTeam: 'Chennai Super Kings', awayTeam: 'Kolkata Knight Riders', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-15', time: '15:30', venue: 'MA Chidambaram Stadium, Chennai' },
    { id: 'ipl-sc3', competition: 'IPL 2025', homeTeam: 'Royal Challengers Bengaluru', awayTeam: 'Sunrisers Hyderabad', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-18', time: '19:30', venue: 'M Chinnaswamy Stadium, Bengaluru' },
  ],
  'PSL': [
    { id: 'psl-sc1', competition: 'PSL 2025', homeTeam: 'Peshawar Zalmi', awayTeam: 'Islamabad United', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-14', time: '19:00', venue: 'Arbab Niaz Stadium, Peshawar' },
    { id: 'psl-sc2', competition: 'PSL 2025', homeTeam: 'Lahore Qalandars', awayTeam: 'Quetta Gladiators', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-16', time: '19:00', venue: 'Gaddafi Stadium, Lahore' },
  ],
  'ICC T20': [
    { id: 'icc-sc1', competition: 'ICC T20 World Cup', homeTeam: '🇮🇳 India', awayTeam: '🇳🇿 New Zealand', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-13', time: '10:00', venue: 'Daren Sammy Stadium, St Lucia' },
    { id: 'icc-sc2', competition: 'ICC T20 World Cup', homeTeam: '🇦🇺 Australia', awayTeam: '🇵🇰 Pakistan', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-14', time: '10:00', venue: 'Kensington Oval, Barbados' },
  ],
  'BBL': [
    { id: 'bbl-sc1', competition: 'BBL 2025/26', homeTeam: 'Sydney Sixers', awayTeam: 'Melbourne Stars', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-15', time: '19:00', venue: 'Sydney Cricket Ground' },
    { id: 'bbl-sc2', competition: 'BBL 2025/26', homeTeam: 'Perth Scorchers', awayTeam: 'Brisbane Heat', homeScore: null, awayScore: null, winner: null, status: 'Upcoming', date: '2026-06-16', time: '19:30', venue: 'Optus Stadium, Perth' },
  ],
}
cricketSchedule['all'] = [
  ...cricketSchedule['IPL'].slice(0, 2),
  ...cricketSchedule['PSL'].slice(0, 1),
  ...cricketSchedule['ICC T20'].slice(0, 2),
  ...cricketSchedule['BBL'].slice(0, 2),
]

export const cricketPlayerDetails: CricketPlayerDetail[] = [
  {
    id: 1, name: 'Virat Kohli', team: 'Royal Challengers Bengaluru', nationality: 'Indian', flag: '🇮🇳',
    role: 'Batsman', age: 37, jersey: 18, image: '', league: 'IPL', rating: 9.4,
    runs: 741, matches: 14, innings: 14, average: 61.75, strikeRate: 142.3,
    fifties: 6, hundreds: 2, wickets: 0, economy: 0, bowlingAvg: 0, fiveWickets: 0, catches: 8,
  },
  {
    id: 2, name: 'Rohit Sharma', team: 'Mumbai Indians', nationality: 'Indian', flag: '🇮🇳',
    role: 'Batsman', age: 38, jersey: 45, image: '', league: 'IPL', rating: 8.9,
    runs: 612, matches: 14, innings: 13, average: 51.0, strikeRate: 148.5,
    fifties: 4, hundreds: 1, wickets: 0, economy: 0, bowlingAvg: 0, fiveWickets: 0, catches: 9,
  },
  {
    id: 3, name: 'Jasprit Bumrah', team: 'Mumbai Indians', nationality: 'Indian', flag: '🇮🇳',
    role: 'Bowler', age: 31, jersey: 93, image: '', league: 'IPL', rating: 9.2,
    runs: 12, matches: 14, innings: 5, average: 4.0, strikeRate: 80.0,
    fifties: 0, hundreds: 0, wickets: 28, economy: 6.4, bowlingAvg: 14.2, fiveWickets: 2, catches: 5,
  },
  {
    id: 4, name: 'Babar Azam', team: 'Karachi Kings', nationality: 'Pakistani', flag: '🇵🇰',
    role: 'Batsman', age: 30, jersey: 56, image: '', league: 'PSL', rating: 9.0,
    runs: 502, matches: 10, innings: 10, average: 55.8, strikeRate: 138.7,
    fifties: 4, hundreds: 1, wickets: 0, economy: 0, bowlingAvg: 0, fiveWickets: 0, catches: 6,
  },
  {
    id: 5, name: 'Shaheen Afridi', team: 'Lahore Qalandars', nationality: 'Pakistani', flag: '🇵🇰',
    role: 'Bowler', age: 25, jersey: 10, image: '', league: 'PSL', rating: 9.1,
    runs: 8, matches: 10, innings: 3, average: 4.0, strikeRate: 66.7,
    fifties: 0, hundreds: 0, wickets: 21, economy: 7.2, bowlingAvg: 16.8, fiveWickets: 1, catches: 3,
  },
  {
    id: 6, name: 'Travis Head', team: 'Adelaide Strikers', nationality: 'Australian', flag: '🇦🇺',
    role: 'Batsman', age: 31, jersey: 35, image: '', league: 'BBL', rating: 8.7,
    runs: 478, matches: 12, innings: 12, average: 43.5, strikeRate: 161.5,
    fifties: 3, hundreds: 1, wickets: 0, economy: 0, bowlingAvg: 0, fiveWickets: 0, catches: 7,
  },
  {
    id: 7, name: 'Pat Cummins', team: 'Sydney Sixers', nationality: 'Australian', flag: '🇦🇺',
    role: 'Bowler', age: 32, jersey: 30, image: '', league: 'BBL', rating: 8.8,
    runs: 45, matches: 12, innings: 6, average: 9.0, strikeRate: 112.5,
    fifties: 0, hundreds: 0, wickets: 18, economy: 7.8, bowlingAvg: 21.3, fiveWickets: 0, catches: 4,
  },
  {
    id: 8, name: 'Ben Stokes', team: '🇬🇧 England', nationality: 'English', flag: '🇬🇧',
    role: 'All-rounder', age: 35, jersey: 55, image: '', league: 'ICC T20', rating: 9.3,
    runs: 286, matches: 5, innings: 5, average: 57.2, strikeRate: 152.4,
    fifties: 3, hundreds: 0, wickets: 7, economy: 8.2, bowlingAvg: 24.1, fiveWickets: 0, catches: 3,
  },
]
