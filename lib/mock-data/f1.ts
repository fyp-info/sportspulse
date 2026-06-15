export interface F1Race {
  round: number
  grandPrix: string
  flag: string
  circuit: string
  date: string
  winner: string
  winnerFlag: string
  team: string
  laps: number
  time: string
}

export interface F1Driver {
  pos: number
  driver: string
  natCode: string
  flag: string
  team: string
  points: number
}

export interface F1Team {
  pos: number
  team: string
  color: string
  points: number
}

export interface F1SeasonData {
  races: F1Race[]
  drivers: F1Driver[]
  teams: F1Team[]
}

export interface F1ScheduleRace {
  round: number
  grandPrix: string
  country: string
  flag: string
  circuit: string
  qualiDate?: string  // e.g. "Sat 14 Jun"
  raceDate: string    // e.g. "Sun 15 Jun"
  raceIso?: string    // ISO for countdown "2026-06-15"
  status: 'completed' | 'weekend' | 'upcoming'
  winner?: string
  winnerFlag?: string
  winnerTeam?: string
}

export const F1_YEARS = [2026, 2025, 2024]

export const f1Data: Record<number, F1SeasonData> = {
  2026: {
    races: [
      { round: 1,  grandPrix: 'Australia',      flag: '🇦🇺', circuit: 'Albert Park',                    date: '15 Mar', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 58, time: '1:23:06.801' },
      { round: 2,  grandPrix: 'China',           flag: '🇨🇳', circuit: 'Shanghai International Circuit', date: '22 Mar', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 56, time: '1:31:55.233' },
      { round: 3,  grandPrix: 'Japan',           flag: '🇯🇵', circuit: 'Suzuka Circuit',                 date: '06 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:29:43.211' },
      { round: 4,  grandPrix: 'Bahrain',         flag: '🇧🇭', circuit: 'Bahrain International Circuit',  date: '20 Apr', winner: 'L. Hamilton',    winnerFlag: '🇬🇧', team: 'Ferrari',          laps: 57, time: '1:28:16.540' },
      { round: 5,  grandPrix: 'Saudi Arabia',    flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',        date: '27 Apr', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 50, time: '1:22:11.894' },
      { round: 6,  grandPrix: 'Miami',           flag: '🇺🇸', circuit: 'Miami International Autodrome',  date: '11 May', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:27:39.582' },
      { round: 7,  grandPrix: 'Emilia Romagna',  flag: '🇮🇹', circuit: 'Autodromo Enzo e Dino Ferrari',  date: '25 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 63, time: '1:32:54.473' },
      { round: 8,  grandPrix: 'Monaco',          flag: '🇲🇨', circuit: 'Circuit de Monaco',              date: '01 Jun', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 78, time: '1:47:26.130' },
      { round: 9,  grandPrix: 'Spain',           flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya', date: '08 Jun', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 66, time: '1:29:45.112' },
    ],
    drivers: [
      { pos: 1,  driver: 'George Russell',     natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',         points: 156 },
      { pos: 2,  driver: 'Lando Norris',       natCode: 'GBR', flag: '🇬🇧', team: 'McLaren',          points: 143 },
      { pos: 3,  driver: 'Max Verstappen',     natCode: 'NLD', flag: '🇳🇱', team: 'Red Bull Racing',  points: 121 },
      { pos: 4,  driver: 'Charles Leclerc',    natCode: 'MON', flag: '🇲🇨', team: 'Ferrari',          points: 98  },
      { pos: 5,  driver: 'Lewis Hamilton',     natCode: 'GBR', flag: '🇬🇧', team: 'Ferrari',          points: 89  },
      { pos: 6,  driver: 'Carlos Sainz',       natCode: 'ESP', flag: '🇪🇸', team: 'Williams',         points: 72  },
      { pos: 7,  driver: 'Oscar Piastri',      natCode: 'AUS', flag: '🇦🇺', team: 'McLaren',          points: 68  },
      { pos: 8,  driver: 'Fernando Alonso',    natCode: 'ESP', flag: '🇪🇸', team: 'Aston Martin',     points: 52  },
      { pos: 9,  driver: 'Yuki Tsunoda',       natCode: 'JPN', flag: '🇯🇵', team: 'Red Bull Racing',  points: 44  },
      { pos: 10, driver: 'Kimi Antonelli',     natCode: 'ITA', flag: '🇮🇹', team: 'Mercedes',         points: 38  },
      { pos: 11, driver: 'Alexander Albon',    natCode: 'THA', flag: '🇹🇭', team: 'Williams',         points: 32  },
      { pos: 12, driver: 'Lance Stroll',       natCode: 'CAN', flag: '🇨🇦', team: 'Aston Martin',     points: 24  },
      { pos: 13, driver: 'Pierre Gasly',       natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',           points: 21  },
      { pos: 14, driver: 'Esteban Ocon',       natCode: 'FRA', flag: '🇫🇷', team: 'Haas',             points: 18  },
      { pos: 15, driver: 'Nico Hülkenberg',    natCode: 'GER', flag: '🇩🇪', team: 'Kick Sauber',      points: 14  },
      { pos: 16, driver: 'Oliver Bearman',     natCode: 'GBR', flag: '🇬🇧', team: 'Haas',             points: 12  },
      { pos: 17, driver: 'Jack Doohan',        natCode: 'AUS', flag: '🇦🇺', team: 'Alpine',           points: 8   },
      { pos: 18, driver: 'Isack Hadjar',       natCode: 'FRA', flag: '🇫🇷', team: 'Racing Bulls',     points: 6   },
      { pos: 19, driver: 'Gabriel Bortoleto',  natCode: 'BRA', flag: '🇧🇷', team: 'Kick Sauber',      points: 4   },
      { pos: 20, driver: 'Liam Lawson',        natCode: 'NZL', flag: '🇳🇿', team: 'Racing Bulls',     points: 2   },
    ],
    teams: [
      { pos: 1, team: 'McLaren',         color: '#FF8000', points: 211 },
      { pos: 2, team: 'Mercedes',        color: '#00D2BE', points: 194 },
      { pos: 3, team: 'Ferrari',         color: '#DC0000', points: 187 },
      { pos: 4, team: 'Red Bull Racing', color: '#3671C6', points: 165 },
      { pos: 5, team: 'Williams',        color: '#005AFF', points: 104 },
      { pos: 6, team: 'Aston Martin',    color: '#006F62', points: 76  },
      { pos: 7, team: 'Alpine',          color: '#0090FF', points: 29  },
      { pos: 8, team: 'Haas',            color: '#B6BABD', points: 30  },
      { pos: 9, team: 'Kick Sauber',     color: '#52E252', points: 18  },
      { pos: 10, team: 'Racing Bulls',   color: '#6692FF', points: 8   },
    ],
  },

  2025: {
    races: [
      { round: 1,  grandPrix: 'Australia',      flag: '🇦🇺', circuit: 'Albert Park',                    date: '16 Mar', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 58, time: '1:21:45.452' },
      { round: 2,  grandPrix: 'China',           flag: '🇨🇳', circuit: 'Shanghai International Circuit', date: '23 Mar', winner: 'O. Piastri',     winnerFlag: '🇦🇺', team: 'McLaren',          laps: 56, time: '1:30:52.134' },
      { round: 3,  grandPrix: 'Japan',           flag: '🇯🇵', circuit: 'Suzuka Circuit',                 date: '06 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:28:24.665' },
      { round: 4,  grandPrix: 'Bahrain',         flag: '🇧🇭', circuit: 'Bahrain International Circuit',  date: '13 Apr', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:29:38.921' },
      { round: 5,  grandPrix: 'Saudi Arabia',    flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',        date: '20 Apr', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 50, time: '1:21:54.789' },
      { round: 6,  grandPrix: 'Miami',           flag: '🇺🇸', circuit: 'Miami International Autodrome',  date: '04 May', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:28:12.456' },
      { round: 7,  grandPrix: 'Emilia Romagna',  flag: '🇮🇹', circuit: 'Autodromo Enzo e Dino Ferrari',  date: '18 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 63, time: '1:31:33.776' },
      { round: 8,  grandPrix: 'Monaco',          flag: '🇲🇨', circuit: 'Circuit de Monaco',              date: '25 May', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 78, time: '1:46:55.342' },
      { round: 9,  grandPrix: 'Spain',           flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya', date: '01 Jun', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 66, time: '1:28:56.234' },
      { round: 10, grandPrix: 'Canada',          flag: '🇨🇦', circuit: 'Circuit Gilles Villeneuve',      date: '15 Jun', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 70, time: '1:41:23.567' },
      { round: 11, grandPrix: 'Austria',         flag: '🇦🇹', circuit: 'Red Bull Ring',                  date: '29 Jun', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 71, time: '1:24:11.894' },
      { round: 12, grandPrix: 'Great Britain',   flag: '🇬🇧', circuit: 'Silverstone Circuit',            date: '06 Jul', winner: 'L. Hamilton',    winnerFlag: '🇬🇧', team: 'Ferrari',          laps: 52, time: '1:25:34.123' },
      { round: 13, grandPrix: 'Belgium',         flag: '🇧🇪', circuit: 'Circuit de Spa-Francorchamps',   date: '27 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 44, time: '1:22:45.678' },
      { round: 14, grandPrix: 'Hungary',         flag: '🇭🇺', circuit: 'Hungaroring',                    date: '03 Aug', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 70, time: '1:38:24.513' },
      { round: 15, grandPrix: 'Netherlands',     flag: '🇳🇱', circuit: 'Circuit Zandvoort',              date: '31 Aug', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 72, time: '1:29:43.256' },
      { round: 16, grandPrix: 'Italy',           flag: '🇮🇹', circuit: 'Autodromo Nazionale Monza',      date: '07 Sep', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 53, time: '1:14:31.345' },
      { round: 17, grandPrix: 'Azerbaijan',      flag: '🇦🇿', circuit: 'Baku City Circuit',              date: '21 Sep', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 51, time: '1:32:55.234' },
      { round: 18, grandPrix: 'Singapore',       flag: '🇸🇬', circuit: 'Marina Bay Street Circuit',      date: '05 Oct', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 62, time: '1:58:04.674' },
      { round: 19, grandPrix: 'United States',   flag: '🇺🇸', circuit: 'Circuit of The Americas',        date: '19 Oct', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 56, time: '1:33:12.345' },
      { round: 20, grandPrix: 'Mexico City',     flag: '🇲🇽', circuit: 'Autodromo Hermanos Rodriguez',   date: '26 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 71, time: '1:38:56.789' },
      { round: 21, grandPrix: 'São Paulo',       flag: '🇧🇷', circuit: 'Autodromo Jose Carlos Pace',    date: '09 Nov', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 71, time: '1:37:22.456' },
      { round: 22, grandPrix: 'Las Vegas',       flag: '🇺🇸', circuit: 'Las Vegas Strip Circuit',        date: '22 Nov', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 50, time: '1:28:45.678' },
      { round: 23, grandPrix: 'Qatar',           flag: '🇶🇦', circuit: 'Lusail International Circuit',   date: '30 Nov', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:22:34.123' },
      { round: 24, grandPrix: 'Abu Dhabi',       flag: '🇦🇪', circuit: 'Yas Marina Circuit',             date: '07 Dec', winner: 'O. Piastri',     winnerFlag: '🇦🇺', team: 'McLaren',          laps: 58, time: '1:26:12.567' },
    ],
    drivers: [
      { pos: 1,  driver: 'Lando Norris',       natCode: 'GBR', flag: '🇬🇧', team: 'McLaren',          points: 421 },
      { pos: 2,  driver: 'Max Verstappen',     natCode: 'NLD', flag: '🇳🇱', team: 'Red Bull Racing',  points: 312 },
      { pos: 3,  driver: 'Oscar Piastri',      natCode: 'AUS', flag: '🇦🇺', team: 'McLaren',          points: 287 },
      { pos: 4,  driver: 'George Russell',     natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',         points: 253 },
      { pos: 5,  driver: 'Charles Leclerc',    natCode: 'MON', flag: '🇲🇨', team: 'Ferrari',          points: 198 },
      { pos: 6,  driver: 'Lewis Hamilton',     natCode: 'GBR', flag: '🇬🇧', team: 'Ferrari',          points: 184 },
      { pos: 7,  driver: 'Carlos Sainz',       natCode: 'ESP', flag: '🇪🇸', team: 'Williams',         points: 143 },
      { pos: 8,  driver: 'Fernando Alonso',    natCode: 'ESP', flag: '🇪🇸', team: 'Aston Martin',     points: 98  },
      { pos: 9,  driver: 'Yuki Tsunoda',       natCode: 'JPN', flag: '🇯🇵', team: 'Red Bull Racing',  points: 87  },
      { pos: 10, driver: 'Kimi Antonelli',     natCode: 'ITA', flag: '🇮🇹', team: 'Mercedes',         points: 76  },
      { pos: 11, driver: 'Alexander Albon',    natCode: 'THA', flag: '🇹🇭', team: 'Williams',         points: 58  },
      { pos: 12, driver: 'Pierre Gasly',       natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',           points: 45  },
      { pos: 13, driver: 'Lance Stroll',       natCode: 'CAN', flag: '🇨🇦', team: 'Aston Martin',     points: 34  },
      { pos: 14, driver: 'Esteban Ocon',       natCode: 'FRA', flag: '🇫🇷', team: 'Haas',             points: 28  },
      { pos: 15, driver: 'Nico Hülkenberg',    natCode: 'GER', flag: '🇩🇪', team: 'Kick Sauber',      points: 22  },
      { pos: 16, driver: 'Oliver Bearman',     natCode: 'GBR', flag: '🇬🇧', team: 'Haas',             points: 16  },
      { pos: 17, driver: 'Jack Doohan',        natCode: 'AUS', flag: '🇦🇺', team: 'Alpine',           points: 12  },
      { pos: 18, driver: 'Isack Hadjar',       natCode: 'FRA', flag: '🇫🇷', team: 'Racing Bulls',     points: 8   },
      { pos: 19, driver: 'Gabriel Bortoleto',  natCode: 'BRA', flag: '🇧🇷', team: 'Kick Sauber',      points: 5   },
      { pos: 20, driver: 'Liam Lawson',        natCode: 'NZL', flag: '🇳🇿', team: 'Racing Bulls',     points: 3   },
    ],
    teams: [
      { pos: 1,  team: 'McLaren',         color: '#FF8000', points: 725 },
      { pos: 2,  team: 'Red Bull Racing', color: '#3671C6', points: 410 },
      { pos: 3,  team: 'Ferrari',         color: '#DC0000', points: 385 },
      { pos: 4,  team: 'Mercedes',        color: '#00D2BE', points: 332 },
      { pos: 5,  team: 'Williams',        color: '#005AFF', points: 201 },
      { pos: 6,  team: 'Aston Martin',    color: '#006F62', points: 132 },
      { pos: 7,  team: 'Alpine',          color: '#0090FF', points: 57  },
      { pos: 8,  team: 'Haas',            color: '#B6BABD', points: 44  },
      { pos: 9,  team: 'Kick Sauber',     color: '#52E252', points: 27  },
      { pos: 10, team: 'Racing Bulls',    color: '#6692FF', points: 11  },
    ],
  },

  2024: {
    races: [
      { round: 1,  grandPrix: 'Bahrain',         flag: '🇧🇭', circuit: 'Bahrain International Circuit',  date: '02 Mar', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 57, time: '1:31:44.742' },
      { round: 2,  grandPrix: 'Saudi Arabia',    flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',        date: '09 Mar', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 50, time: '1:20:43.273' },
      { round: 3,  grandPrix: 'Australia',       flag: '🇦🇺', circuit: 'Albert Park',                    date: '24 Mar', winner: 'C. Sainz',       winnerFlag: '🇪🇸', team: 'Ferrari',          laps: 58, time: '1:20:26.843' },
      { round: 4,  grandPrix: 'Japan',           flag: '🇯🇵', circuit: 'Suzuka Circuit',                 date: '07 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:26:50.579' },
      { round: 5,  grandPrix: 'China',           flag: '🇨🇳', circuit: 'Shanghai International Circuit', date: '21 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 56, time: '1:40:52.554' },
      { round: 6,  grandPrix: 'Miami',           flag: '🇺🇸', circuit: 'Miami International Autodrome',  date: '05 May', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:30:49.876' },
      { round: 7,  grandPrix: 'Emilia Romagna',  flag: '🇮🇹', circuit: 'Autodromo Enzo e Dino Ferrari',  date: '19 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 63, time: '1:22:22.986' },
      { round: 8,  grandPrix: 'Monaco',          flag: '🇲🇨', circuit: 'Circuit de Monaco',              date: '26 May', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 78, time: '1:49:54.643' },
      { round: 9,  grandPrix: 'Canada',          flag: '🇨🇦', circuit: 'Circuit Gilles Villeneuve',      date: '09 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 70, time: '1:45:47.927' },
      { round: 10, grandPrix: 'Spain',           flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya', date: '23 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 66, time: '1:25:05.407' },
      { round: 11, grandPrix: 'Austria',         flag: '🇦🇹', circuit: 'Red Bull Ring',                  date: '30 Jun', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 71, time: '1:25:37.937' },
      { round: 12, grandPrix: 'Great Britain',   flag: '🇬🇧', circuit: 'Silverstone Circuit',            date: '07 Jul', winner: 'L. Hamilton',    winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 52, time: '1:22:27.095' },
      { round: 13, grandPrix: 'Hungary',         flag: '🇭🇺', circuit: 'Hungaroring',                    date: '21 Jul', winner: 'O. Piastri',     winnerFlag: '🇦🇺', team: 'McLaren',          laps: 70, time: '1:37:14.994' },
      { round: 14, grandPrix: 'Belgium',         flag: '🇧🇪', circuit: 'Circuit de Spa-Francorchamps',   date: '28 Jul', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 44, time: '1:14:47.106' },
      { round: 15, grandPrix: 'Netherlands',     flag: '🇳🇱', circuit: 'Circuit Zandvoort',              date: '25 Aug', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 72, time: '1:30:20.895' },
      { round: 16, grandPrix: 'Italy',           flag: '🇮🇹', circuit: 'Autodromo Nazionale Monza',      date: '01 Sep', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 53, time: '1:14:40.727' },
      { round: 17, grandPrix: 'Azerbaijan',      flag: '🇦🇿', circuit: 'Baku City Circuit',              date: '15 Sep', winner: 'O. Piastri',     winnerFlag: '🇦🇺', team: 'McLaren',          laps: 51, time: '1:26:32.225' },
      { round: 18, grandPrix: 'Singapore',       flag: '🇸🇬', circuit: 'Marina Bay Street Circuit',      date: '22 Sep', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 62, time: '1:54:15.765' },
      { round: 19, grandPrix: 'United States',   flag: '🇺🇸', circuit: 'Circuit of The Americas',        date: '20 Oct', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 56, time: '1:35:09.639' },
      { round: 20, grandPrix: 'Mexico City',     flag: '🇲🇽', circuit: 'Autodromo Hermanos Rodriguez',   date: '27 Oct', winner: 'C. Sainz',       winnerFlag: '🇪🇸', team: 'Ferrari',          laps: 71, time: '1:31:40.789' },
      { round: 21, grandPrix: 'São Paulo',       flag: '🇧🇷', circuit: 'Autodromo Jose Carlos Pace',    date: '03 Nov', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 69, time: '1:34:06.453' },
      { round: 22, grandPrix: 'Las Vegas',       flag: '🇺🇸', circuit: 'Las Vegas Strip Circuit',        date: '23 Nov', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 50, time: '1:29:21.345' },
      { round: 23, grandPrix: 'Qatar',           flag: '🇶🇦', circuit: 'Lusail International Circuit',   date: '01 Dec', winner: 'L. Norris',      winnerFlag: '🇬🇧', team: 'McLaren',          laps: 57, time: '1:24:10.428' },
      { round: 24, grandPrix: 'Abu Dhabi',       flag: '🇦🇪', circuit: 'Yas Marina Circuit',             date: '08 Dec', winner: 'L. Hamilton',    winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 58, time: '1:23:18.564' },
    ],
    drivers: [
      { pos: 1,  driver: 'Max Verstappen',     natCode: 'NLD', flag: '🇳🇱', team: 'Red Bull Racing',  points: 437 },
      { pos: 2,  driver: 'Lando Norris',       natCode: 'GBR', flag: '🇬🇧', team: 'McLaren',          points: 374 },
      { pos: 3,  driver: 'Charles Leclerc',    natCode: 'MON', flag: '🇲🇨', team: 'Ferrari',          points: 321 },
      { pos: 4,  driver: 'Carlos Sainz',       natCode: 'ESP', flag: '🇪🇸', team: 'Ferrari',          points: 290 },
      { pos: 5,  driver: 'Oscar Piastri',      natCode: 'AUS', flag: '🇦🇺', team: 'McLaren',          points: 248 },
      { pos: 6,  driver: 'George Russell',     natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',         points: 213 },
      { pos: 7,  driver: 'Lewis Hamilton',     natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',         points: 191 },
      { pos: 8,  driver: 'Sergio Pérez',       natCode: 'MEX', flag: '🇲🇽', team: 'Red Bull Racing',  points: 152 },
      { pos: 9,  driver: 'Fernando Alonso',    natCode: 'ESP', flag: '🇪🇸', team: 'Aston Martin',     points: 98  },
      { pos: 10, driver: 'Lance Stroll',       natCode: 'CAN', flag: '🇨🇦', team: 'Aston Martin',     points: 65  },
      { pos: 11, driver: 'Yuki Tsunoda',       natCode: 'JPN', flag: '🇯🇵', team: 'Racing Bulls',     points: 54  },
      { pos: 12, driver: 'Alexander Albon',    natCode: 'THA', flag: '🇹🇭', team: 'Williams',         points: 46  },
      { pos: 13, driver: 'Pierre Gasly',       natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',           points: 42  },
      { pos: 14, driver: 'Nico Hülkenberg',    natCode: 'GER', flag: '🇩🇪', team: 'Kick Sauber',      points: 31  },
      { pos: 15, driver: 'Esteban Ocon',       natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',           points: 23  },
      { pos: 16, driver: 'Kevin Magnussen',    natCode: 'DEN', flag: '🇩🇰', team: 'Haas',             points: 16  },
      { pos: 17, driver: 'Oliver Bearman',     natCode: 'GBR', flag: '🇬🇧', team: 'Haas',             points: 13  },
      { pos: 18, driver: 'Valtteri Bottas',    natCode: 'FIN', flag: '🇫🇮', team: 'Kick Sauber',      points: 4   },
      { pos: 19, driver: 'Liam Lawson',        natCode: 'NZL', flag: '🇳🇿', team: 'Racing Bulls',     points: 2   },
      { pos: 20, driver: 'Logan Sargeant',     natCode: 'USA', flag: '🇺🇸', team: 'Williams',         points: 0   },
    ],
    teams: [
      { pos: 1,  team: 'McLaren',         color: '#FF8000', points: 666 },
      { pos: 2,  team: 'Ferrari',         color: '#DC0000', points: 652 },
      { pos: 3,  team: 'Red Bull Racing', color: '#3671C6', points: 589 },
      { pos: 4,  team: 'Mercedes',        color: '#00D2BE', points: 432 },
      { pos: 5,  team: 'Aston Martin',    color: '#006F62', points: 94  },
      { pos: 6,  team: 'Alpine',          color: '#0090FF', points: 65  },
      { pos: 7,  team: 'Racing Bulls',    color: '#6692FF', points: 46  },
      { pos: 8,  team: 'Williams',        color: '#005AFF', points: 16  },
      { pos: 9,  team: 'Haas',            color: '#B6BABD', points: 6   },
      { pos: 10, team: 'Kick Sauber',     color: '#52E252', points: 4   },
    ],
  },

  2023: {
    races: [
      { round: 1,  grandPrix: 'Bahrain',         flag: '🇧🇭', circuit: 'Bahrain International Circuit',  date: '05 Mar', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 57, time: '1:33:56.736' },
      { round: 2,  grandPrix: 'Saudi Arabia',    flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',        date: '19 Mar', winner: 'S. Pérez',       winnerFlag: '🇲🇽', team: 'Red Bull Racing',  laps: 50, time: '1:21:14.894' },
      { round: 3,  grandPrix: 'Australia',       flag: '🇦🇺', circuit: 'Albert Park',                    date: '02 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 58, time: '1:27:38.241' },
      { round: 4,  grandPrix: 'Azerbaijan',      flag: '🇦🇿', circuit: 'Baku City Circuit',              date: '30 Apr', winner: 'S. Pérez',       winnerFlag: '🇲🇽', team: 'Red Bull Racing',  laps: 51, time: '1:28:42.624' },
      { round: 5,  grandPrix: 'Miami',           flag: '🇺🇸', circuit: 'Miami International Autodrome',  date: '07 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 57, time: '1:26:41.049' },
      { round: 6,  grandPrix: 'Monaco',          flag: '🇲🇨', circuit: 'Circuit de Monaco',              date: '28 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 78, time: '1:48:51.980' },
      { round: 7,  grandPrix: 'Spain',           flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya', date: '04 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 66, time: '1:27:43.473' },
      { round: 8,  grandPrix: 'Canada',          flag: '🇨🇦', circuit: 'Circuit Gilles Villeneuve',      date: '18 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 70, time: '1:30:06.897' },
      { round: 9,  grandPrix: 'Austria',         flag: '🇦🇹', circuit: 'Red Bull Ring',                  date: '02 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 71, time: '1:25:33.585' },
      { round: 10, grandPrix: 'Great Britain',   flag: '🇬🇧', circuit: 'Silverstone Circuit',            date: '09 Jul', winner: 'L. Hamilton',    winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 52, time: '1:24:09.765' },
      { round: 11, grandPrix: 'Hungary',         flag: '🇭🇺', circuit: 'Hungaroring',                    date: '23 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 70, time: '1:38:33.736' },
      { round: 12, grandPrix: 'Belgium',         flag: '🇧🇪', circuit: 'Circuit de Spa-Francorchamps',   date: '30 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 44, time: '1:22:27.311' },
      { round: 13, grandPrix: 'Netherlands',     flag: '🇳🇱', circuit: 'Circuit Zandvoort',              date: '27 Aug', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 72, time: '1:30:35.681' },
      { round: 14, grandPrix: 'Italy',           flag: '🇮🇹', circuit: 'Autodromo Nazionale Monza',      date: '03 Sep', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:13:41.143' },
      { round: 15, grandPrix: 'Singapore',       flag: '🇸🇬', circuit: 'Marina Bay Street Circuit',      date: '17 Sep', winner: 'C. Sainz',       winnerFlag: '🇪🇸', team: 'Ferrari',          laps: 62, time: '1:46:37.418' },
      { round: 16, grandPrix: 'Japan',           flag: '🇯🇵', circuit: 'Suzuka Circuit',                 date: '24 Sep', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:30:58.421' },
      { round: 17, grandPrix: 'Qatar',           flag: '🇶🇦', circuit: 'Lusail International Circuit',   date: '08 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 57, time: '1:27:39.624' },
      { round: 18, grandPrix: 'United States',   flag: '🇺🇸', circuit: 'Circuit of The Americas',        date: '22 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 56, time: '1:34:48.965' },
      { round: 19, grandPrix: 'Mexico City',     flag: '🇲🇽', circuit: 'Autodromo Hermanos Rodriguez',   date: '29 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 71, time: '1:38:36.030' },
      { round: 20, grandPrix: 'São Paulo',       flag: '🇧🇷', circuit: 'Autodromo Jose Carlos Pace',    date: '05 Nov', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 71, time: '1:56:48.894' },
      { round: 21, grandPrix: 'Las Vegas',       flag: '🇺🇸', circuit: 'Las Vegas Strip Circuit',        date: '18 Nov', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 50, time: '1:29:08.289' },
      { round: 22, grandPrix: 'Abu Dhabi',       flag: '🇦🇪', circuit: 'Yas Marina Circuit',             date: '26 Nov', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 58, time: '1:27:02.624' },
    ],
    drivers: [
      { pos: 1,  driver: 'Max Verstappen',   natCode: 'NLD', flag: '🇳🇱', team: 'Red Bull Racing', points: 575 },
      { pos: 2,  driver: 'Sergio Pérez',     natCode: 'MEX', flag: '🇲🇽', team: 'Red Bull Racing', points: 285 },
      { pos: 3,  driver: 'Lewis Hamilton',   natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',        points: 234 },
      { pos: 4,  driver: 'Fernando Alonso',  natCode: 'ESP', flag: '🇪🇸', team: 'Aston Martin',    points: 206 },
      { pos: 5,  driver: 'Charles Leclerc',  natCode: 'MON', flag: '🇲🇨', team: 'Ferrari',         points: 206 },
      { pos: 6,  driver: 'Lando Norris',     natCode: 'GBR', flag: '🇬🇧', team: 'McLaren',         points: 205 },
      { pos: 7,  driver: 'Carlos Sainz',     natCode: 'ESP', flag: '🇪🇸', team: 'Ferrari',         points: 200 },
      { pos: 8,  driver: 'George Russell',   natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',        points: 175 },
      { pos: 9,  driver: 'Oscar Piastri',    natCode: 'AUS', flag: '🇦🇺', team: 'McLaren',         points: 97  },
      { pos: 10, driver: 'Lance Stroll',     natCode: 'CAN', flag: '🇨🇦', team: 'Aston Martin',    points: 74  },
      { pos: 11, driver: 'Pierre Gasly',     natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',          points: 62  },
      { pos: 12, driver: 'Esteban Ocon',     natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',          points: 58  },
      { pos: 13, driver: 'Alexander Albon',  natCode: 'THA', flag: '🇹🇭', team: 'Williams',        points: 27  },
      { pos: 14, driver: 'Valtteri Bottas',  natCode: 'FIN', flag: '🇫🇮', team: 'Alfa Romeo',      points: 10  },
      { pos: 15, driver: 'Nico Hülkenberg',  natCode: 'GER', flag: '🇩🇪', team: 'Haas',            points: 9   },
      { pos: 16, driver: 'Yuki Tsunoda',     natCode: 'JPN', flag: '🇯🇵', team: 'AlphaTauri',      points: 17  },
      { pos: 17, driver: 'Guanyu Zhou',      natCode: 'CHN', flag: '🇨🇳', team: 'Alfa Romeo',      points: 6   },
      { pos: 18, driver: 'Kevin Magnussen',  natCode: 'DEN', flag: '🇩🇰', team: 'Haas',            points: 3   },
      { pos: 19, driver: 'Logan Sargeant',   natCode: 'USA', flag: '🇺🇸', team: 'Williams',        points: 1   },
      { pos: 20, driver: 'Nyck de Vries',    natCode: 'NLD', flag: '🇳🇱', team: 'AlphaTauri',      points: 0   },
    ],
    teams: [
      { pos: 1,  team: 'Red Bull Racing', color: '#3671C6', points: 860 },
      { pos: 2,  team: 'Mercedes',        color: '#00D2BE', points: 409 },
      { pos: 3,  team: 'Ferrari',         color: '#DC0000', points: 406 },
      { pos: 4,  team: 'McLaren',         color: '#FF8000', points: 302 },
      { pos: 5,  team: 'Aston Martin',    color: '#006F62', points: 280 },
      { pos: 6,  team: 'Alpine',          color: '#0090FF', points: 120 },
      { pos: 7,  team: 'Williams',        color: '#005AFF', points: 28  },
      { pos: 8,  team: 'AlphaTauri',      color: '#6692FF', points: 25  },
      { pos: 9,  team: 'Alfa Romeo',      color: '#B12335', points: 16  },
      { pos: 10, team: 'Haas',            color: '#B6BABD', points: 12  },
    ],
  },

  2022: {
    races: [
      { round: 1,  grandPrix: 'Bahrain',         flag: '🇧🇭', circuit: 'Bahrain International Circuit',  date: '20 Mar', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 57, time: '1:37:33.584' },
      { round: 2,  grandPrix: 'Saudi Arabia',    flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',        date: '27 Mar', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 50, time: '1:24:19.293' },
      { round: 3,  grandPrix: 'Australia',       flag: '🇦🇺', circuit: 'Albert Park',                    date: '10 Apr', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 58, time: '1:27:46.548' },
      { round: 4,  grandPrix: 'Emilia Romagna',  flag: '🇮🇹', circuit: 'Autodromo Enzo e Dino Ferrari',  date: '24 Apr', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 63, time: '1:32:07.986' },
      { round: 5,  grandPrix: 'Miami',           flag: '🇺🇸', circuit: 'Miami International Autodrome',  date: '08 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 57, time: '1:34:24.258' },
      { round: 6,  grandPrix: 'Spain',           flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya', date: '22 May', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 66, time: '1:37:14.892' },
      { round: 7,  grandPrix: 'Monaco',          flag: '🇲🇨', circuit: 'Circuit de Monaco',              date: '29 May', winner: 'S. Pérez',       winnerFlag: '🇲🇽', team: 'Red Bull Racing',  laps: 64, time: '1:56:30.265' },
      { round: 8,  grandPrix: 'Azerbaijan',      flag: '🇦🇿', circuit: 'Baku City Circuit',              date: '12 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 51, time: '1:24:41.413' },
      { round: 9,  grandPrix: 'Canada',          flag: '🇨🇦', circuit: 'Circuit Gilles Villeneuve',      date: '19 Jun', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 70, time: '1:36:21.757' },
      { round: 10, grandPrix: 'Great Britain',   flag: '🇬🇧', circuit: 'Silverstone Circuit',            date: '03 Jul', winner: 'C. Sainz',       winnerFlag: '🇪🇸', team: 'Ferrari',          laps: 52, time: '1:41:29.179' },
      { round: 11, grandPrix: 'Austria',         flag: '🇦🇹', circuit: 'Red Bull Ring',                  date: '10 Jul', winner: 'C. Leclerc',     winnerFlag: '🇲🇨', team: 'Ferrari',          laps: 71, time: '1:24:24.312' },
      { round: 12, grandPrix: 'France',          flag: '🇫🇷', circuit: 'Circuit Paul Ricard',            date: '24 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:30:02.112' },
      { round: 13, grandPrix: 'Hungary',         flag: '🇭🇺', circuit: 'Hungaroring',                    date: '31 Jul', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 70, time: '1:39:36.533' },
      { round: 14, grandPrix: 'Belgium',         flag: '🇧🇪', circuit: 'Circuit de Spa-Francorchamps',   date: '28 Aug', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 44, time: '1:25:52.765' },
      { round: 15, grandPrix: 'Netherlands',     flag: '🇳🇱', circuit: 'Circuit Zandvoort',              date: '04 Sep', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 72, time: '1:36:15.310' },
      { round: 16, grandPrix: 'Italy',           flag: '🇮🇹', circuit: 'Autodromo Nazionale Monza',      date: '11 Sep', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 53, time: '1:20:27.511' },
      { round: 17, grandPrix: 'Singapore',       flag: '🇸🇬', circuit: 'Marina Bay Street Circuit',      date: '02 Oct', winner: 'S. Pérez',       winnerFlag: '🇲🇽', team: 'Red Bull Racing',  laps: 59, time: '2:02:15.238' },
      { round: 18, grandPrix: 'Japan',           flag: '🇯🇵', circuit: 'Suzuka Circuit',                 date: '09 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 28, time: '3:01:44.004' },
      { round: 19, grandPrix: 'United States',   flag: '🇺🇸', circuit: 'Circuit of The Americas',        date: '23 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 56, time: '1:42:11.687' },
      { round: 20, grandPrix: 'Mexico City',     flag: '🇲🇽', circuit: 'Autodromo Hermanos Rodriguez',   date: '30 Oct', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 71, time: '1:38:36.127' },
      { round: 21, grandPrix: 'São Paulo',       flag: '🇧🇷', circuit: 'Autodromo Jose Carlos Pace',    date: '13 Nov', winner: 'G. Russell',     winnerFlag: '🇬🇧', team: 'Mercedes',         laps: 71, time: '1:38:34.044' },
      { round: 22, grandPrix: 'Abu Dhabi',       flag: '🇦🇪', circuit: 'Yas Marina Circuit',             date: '20 Nov', winner: 'M. Verstappen',  winnerFlag: '🇳🇱', team: 'Red Bull Racing',  laps: 58, time: '1:27:45.914' },
    ],
    drivers: [
      { pos: 1,  driver: 'Max Verstappen',   natCode: 'NLD', flag: '🇳🇱', team: 'Red Bull Racing', points: 454 },
      { pos: 2,  driver: 'Charles Leclerc',  natCode: 'MON', flag: '🇲🇨', team: 'Ferrari',         points: 308 },
      { pos: 3,  driver: 'Sergio Pérez',     natCode: 'MEX', flag: '🇲🇽', team: 'Red Bull Racing', points: 305 },
      { pos: 4,  driver: 'George Russell',   natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',        points: 275 },
      { pos: 5,  driver: 'Carlos Sainz',     natCode: 'ESP', flag: '🇪🇸', team: 'Ferrari',         points: 246 },
      { pos: 6,  driver: 'Lewis Hamilton',   natCode: 'GBR', flag: '🇬🇧', team: 'Mercedes',        points: 240 },
      { pos: 7,  driver: 'Valtteri Bottas',  natCode: 'FIN', flag: '🇫🇮', team: 'Alfa Romeo',      points: 49  },
      { pos: 8,  driver: 'Esteban Ocon',     natCode: 'FRA', flag: '🇫🇷', team: 'Alpine',          points: 92  },
      { pos: 9,  driver: 'Lance Stroll',     natCode: 'CAN', flag: '🇨🇦', team: 'Aston Martin',    points: 18  },
      { pos: 10, driver: 'Sebastian Vettel', natCode: 'GER', flag: '🇩🇪', team: 'Aston Martin',    points: 37  },
      { pos: 11, driver: 'Fernando Alonso',  natCode: 'ESP', flag: '🇪🇸', team: 'Alpine',          points: 81  },
      { pos: 12, driver: 'Lando Norris',     natCode: 'GBR', flag: '🇬🇧', team: 'McLaren',         points: 122 },
      { pos: 13, driver: 'Mick Schumacher',  natCode: 'GER', flag: '🇩🇪', team: 'Haas',            points: 12  },
      { pos: 14, driver: 'Pierre Gasly',     natCode: 'FRA', flag: '🇫🇷', team: 'AlphaTauri',      points: 23  },
      { pos: 15, driver: 'Guanyu Zhou',      natCode: 'CHN', flag: '🇨🇳', team: 'Alfa Romeo',      points: 6   },
      { pos: 16, driver: 'Daniel Ricciardo', natCode: 'AUS', flag: '🇦🇺', team: 'McLaren',         points: 37  },
      { pos: 17, driver: 'Yuki Tsunoda',     natCode: 'JPN', flag: '🇯🇵', team: 'AlphaTauri',      points: 12  },
      { pos: 18, driver: 'Kevin Magnussen',  natCode: 'DEN', flag: '🇩🇰', team: 'Haas',            points: 25  },
      { pos: 19, driver: 'Alexander Albon',  natCode: 'THA', flag: '🇹🇭', team: 'Williams',        points: 6   },
      { pos: 20, driver: 'Nicholas Latifi',  natCode: 'CAN', flag: '🇨🇦', team: 'Williams',        points: 2   },
    ],
    teams: [
      { pos: 1,  team: 'Red Bull Racing', color: '#3671C6', points: 759 },
      { pos: 2,  team: 'Ferrari',         color: '#DC0000', points: 554 },
      { pos: 3,  team: 'Mercedes',        color: '#00D2BE', points: 515 },
      { pos: 4,  team: 'Alpine',          color: '#0090FF', points: 173 },
      { pos: 5,  team: 'McLaren',         color: '#FF8000', points: 159 },
      { pos: 6,  team: 'Alfa Romeo',      color: '#B12335', points: 55  },
      { pos: 7,  team: 'Aston Martin',    color: '#006F62', points: 55  },
      { pos: 8,  team: 'Haas',            color: '#B6BABD', points: 37  },
      { pos: 9,  team: 'AlphaTauri',      color: '#6692FF', points: 35  },
      { pos: 10, team: 'Williams',        color: '#005AFF', points: 8   },
    ],
  },
}

// Full 2026 schedule — completed rounds derived from race results, upcoming added here
export const f1Schedule2026: F1ScheduleRace[] = [
  { round: 1,  grandPrix: 'Australian Grand Prix',     country: 'Australia',    flag: '🇦🇺', circuit: 'Albert Park Circuit',              qualiDate: 'Sat 14 Mar', raceDate: 'Sun 15 Mar', raceIso: '2026-03-15', status: 'completed', winner: 'G. Russell',    winnerFlag: '🇬🇧', winnerTeam: 'Mercedes' },
  { round: 2,  grandPrix: 'Chinese Grand Prix',        country: 'China',        flag: '🇨🇳', circuit: 'Shanghai International Circuit',   qualiDate: 'Sat 21 Mar', raceDate: 'Sun 22 Mar', raceIso: '2026-03-22', status: 'completed', winner: 'L. Norris',     winnerFlag: '🇬🇧', winnerTeam: 'McLaren' },
  { round: 3,  grandPrix: 'Japanese Grand Prix',       country: 'Japan',        flag: '🇯🇵', circuit: 'Suzuka International Racing Course', qualiDate: 'Sat 05 Apr', raceDate: 'Sun 06 Apr', raceIso: '2026-04-06', status: 'completed', winner: 'M. Verstappen', winnerFlag: '🇳🇱', winnerTeam: 'Red Bull Racing' },
  { round: 4,  grandPrix: 'Bahrain Grand Prix',        country: 'Bahrain',      flag: '🇧🇭', circuit: 'Bahrain International Circuit',    qualiDate: 'Sat 19 Apr', raceDate: 'Sun 20 Apr', raceIso: '2026-04-20', status: 'completed', winner: 'L. Hamilton',   winnerFlag: '🇬🇧', winnerTeam: 'Ferrari' },
  { round: 5,  grandPrix: 'Saudi Arabian Grand Prix',  country: 'Saudi Arabia', flag: '🇸🇦', circuit: 'Jeddah Corniche Circuit',          qualiDate: 'Sat 26 Apr', raceDate: 'Sun 27 Apr', raceIso: '2026-04-27', status: 'completed', winner: 'G. Russell',    winnerFlag: '🇬🇧', winnerTeam: 'Mercedes' },
  { round: 6,  grandPrix: 'Miami Grand Prix',          country: 'United States',flag: '🇺🇸', circuit: 'Miami International Autodrome',    qualiDate: 'Sat 10 May', raceDate: 'Sun 11 May', raceIso: '2026-05-11', status: 'completed', winner: 'L. Norris',     winnerFlag: '🇬🇧', winnerTeam: 'McLaren' },
  { round: 7,  grandPrix: 'Emilia Romagna Grand Prix', country: 'Italy',        flag: '🇮🇹', circuit: 'Autodromo Enzo e Dino Ferrari',    qualiDate: 'Sat 24 May', raceDate: 'Sun 25 May', raceIso: '2026-05-25', status: 'completed', winner: 'M. Verstappen', winnerFlag: '🇳🇱', winnerTeam: 'Red Bull Racing' },
  { round: 8,  grandPrix: 'Monaco Grand Prix',         country: 'Monaco',       flag: '🇲🇨', circuit: 'Circuit de Monaco',               qualiDate: 'Sat 31 May', raceDate: 'Sun 01 Jun', raceIso: '2026-06-01', status: 'completed', winner: 'C. Leclerc',    winnerFlag: '🇲🇨', winnerTeam: 'Ferrari' },
  { round: 9,  grandPrix: 'Spanish Grand Prix',        country: 'Spain',        flag: '🇪🇸', circuit: 'Circuit de Barcelona-Catalunya',   qualiDate: 'Sat 07 Jun', raceDate: 'Sun 08 Jun', raceIso: '2026-06-08', status: 'completed', winner: 'G. Russell',    winnerFlag: '🇬🇧', winnerTeam: 'Mercedes' },
  { round: 10, grandPrix: 'Canadian Grand Prix',       country: 'Canada',       flag: '🇨🇦', circuit: 'Circuit Gilles Villeneuve',        qualiDate: 'Sat 14 Jun', raceDate: 'Sun 15 Jun', raceIso: '2026-06-15', status: 'weekend' },
  { round: 11, grandPrix: 'Austrian Grand Prix',       country: 'Austria',      flag: '🇦🇹', circuit: 'Red Bull Ring',                   qualiDate: 'Sat 28 Jun', raceDate: 'Sun 29 Jun', raceIso: '2026-06-29', status: 'upcoming' },
  { round: 12, grandPrix: 'British Grand Prix',        country: 'Great Britain',flag: '🇬🇧', circuit: 'Silverstone Circuit',              qualiDate: 'Sat 05 Jul', raceDate: 'Sun 06 Jul', raceIso: '2026-07-06', status: 'upcoming' },
  { round: 13, grandPrix: 'Belgian Grand Prix',        country: 'Belgium',      flag: '🇧🇪', circuit: 'Circuit de Spa-Francorchamps',    qualiDate: 'Sat 26 Jul', raceDate: 'Sun 27 Jul', raceIso: '2026-07-27', status: 'upcoming' },
  { round: 14, grandPrix: 'Hungarian Grand Prix',      country: 'Hungary',      flag: '🇭🇺', circuit: 'Hungaroring',                     qualiDate: 'Sat 02 Aug', raceDate: 'Sun 03 Aug', raceIso: '2026-08-03', status: 'upcoming' },
  { round: 15, grandPrix: 'Dutch Grand Prix',          country: 'Netherlands',  flag: '🇳🇱', circuit: 'Circuit Zandvoort',               qualiDate: 'Sat 30 Aug', raceDate: 'Sun 31 Aug', raceIso: '2026-08-31', status: 'upcoming' },
  { round: 16, grandPrix: 'Italian Grand Prix',        country: 'Italy',        flag: '🇮🇹', circuit: 'Autodromo Nazionale Monza',        qualiDate: 'Sat 06 Sep', raceDate: 'Sun 07 Sep', raceIso: '2026-09-07', status: 'upcoming' },
  { round: 17, grandPrix: 'Azerbaijan Grand Prix',     country: 'Azerbaijan',   flag: '🇦🇿', circuit: 'Baku City Circuit',               qualiDate: 'Sat 20 Sep', raceDate: 'Sun 21 Sep', raceIso: '2026-09-21', status: 'upcoming' },
  { round: 18, grandPrix: 'Singapore Grand Prix',      country: 'Singapore',    flag: '🇸🇬', circuit: 'Marina Bay Street Circuit',        qualiDate: 'Sat 04 Oct', raceDate: 'Sun 05 Oct', raceIso: '2026-10-05', status: 'upcoming' },
  { round: 19, grandPrix: 'United States Grand Prix',  country: 'United States',flag: '🇺🇸', circuit: 'Circuit of The Americas',          qualiDate: 'Sat 18 Oct', raceDate: 'Sun 19 Oct', raceIso: '2026-10-19', status: 'upcoming' },
  { round: 20, grandPrix: 'Mexico City Grand Prix',    country: 'Mexico',       flag: '🇲🇽', circuit: 'Autódromo Hermanos Rodríguez',    qualiDate: 'Sat 25 Oct', raceDate: 'Sun 26 Oct', raceIso: '2026-10-26', status: 'upcoming' },
  { round: 21, grandPrix: 'São Paulo Grand Prix',      country: 'Brazil',       flag: '🇧🇷', circuit: 'Autódromo José Carlos Pace',      qualiDate: 'Sat 08 Nov', raceDate: 'Sun 09 Nov', raceIso: '2026-11-09', status: 'upcoming' },
  { round: 22, grandPrix: 'Las Vegas Grand Prix',      country: 'United States',flag: '🇺🇸', circuit: 'Las Vegas Strip Circuit',          qualiDate: 'Sat 21 Nov', raceDate: 'Sun 22 Nov', raceIso: '2026-11-22', status: 'upcoming' },
  { round: 23, grandPrix: 'Qatar Grand Prix',          country: 'Qatar',        flag: '🇶🇦', circuit: 'Lusail International Circuit',     qualiDate: 'Sat 29 Nov', raceDate: 'Sun 30 Nov', raceIso: '2026-11-30', status: 'upcoming' },
  { round: 24, grandPrix: 'Abu Dhabi Grand Prix',      country: 'Abu Dhabi',    flag: '🇦🇪', circuit: 'Yas Marina Circuit',               qualiDate: 'Sat 06 Dec', raceDate: 'Sun 07 Dec', raceIso: '2026-12-07', status: 'upcoming' },
]
