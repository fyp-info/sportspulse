import { cn } from '@/lib/utils'

interface FootballRow { pos: number; team: string; played: number; won: number; drawn: number; lost: number; gd: number; points: number }
interface F1Row { pos: number; driver: string; team: string; nationality: string; points: number }
interface NBARow { pos: number; team: string; conf: string; won: number; lost: number; pct: string; gb: string }
interface IPLRow { pos: number; team: string; played: number; won: number; lost: number; nrr: string; points: number }

type StandingRow = FootballRow | F1Row | NBARow | IPLRow

interface Props {
  title: string
  data: StandingRow[]
  sport: 'football' | 'f1' | 'nba' | 'ipl'
}

export default function StandingsTable({ title, data, sport }: Props) {
  if (sport === 'football') {
    const rows = data as FootballRow[]
    return (
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.pos} className={cn('border-b border-gray-50 hover:bg-gray-50', i < 4 && 'border-l-2 border-l-blue-400')}>
                  <td className="px-3 py-2.5 font-medium text-gray-600">{row.pos}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-900">{row.team}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.played}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.won}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.drawn}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.lost}</td>
                  <td className={cn('px-3 py-2.5', row.gd > 0 ? 'text-green-600' : 'text-red-500')}>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="px-3 py-2.5 font-bold text-gray-900">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (sport === 'f1') {
    const rows = data as F1Row[]
    return (
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Driver', 'Team', 'Nat', 'Pts'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.pos} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-medium text-gray-600">{row.pos}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-900">{row.driver}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.team}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.nationality}</td>
                  <td className="px-3 py-2.5 font-bold text-orange-500">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (sport === 'nba') {
    const rows = data as NBARow[]
    return (
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['#', 'Team', 'W', 'L', 'PCT', 'GB'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.team}`} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-medium text-gray-600">{row.pos}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-900">{row.team}</td>
                  <td className="px-3 py-2.5 text-green-600 font-medium">{row.won}</td>
                  <td className="px-3 py-2.5 text-red-500 font-medium">{row.lost}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.pct}</td>
                  <td className="px-3 py-2.5 text-gray-500">{row.gb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const rows = data as IPLRow[]
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['#', 'Team', 'P', 'W', 'L', 'NRR', 'Pts'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.pos} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-gray-600">{row.pos}</td>
                <td className="px-3 py-2.5 font-medium text-gray-900">{row.team}</td>
                <td className="px-3 py-2.5 text-gray-500">{row.played}</td>
                <td className="px-3 py-2.5 text-green-600">{row.won}</td>
                <td className="px-3 py-2.5 text-red-500">{row.lost}</td>
                <td className={cn('px-3 py-2.5', row.nrr.startsWith('+') ? 'text-green-600' : 'text-red-500')}>{row.nrr}</td>
                <td className="px-3 py-2.5 font-bold text-gray-900">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
