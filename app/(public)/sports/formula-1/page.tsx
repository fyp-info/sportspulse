'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, Trophy, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { F1_YEARS, f1Data, f1Schedule2026, type F1Driver, type F1Team, type F1ScheduleRace } from '@/lib/mock-data/f1'

// ---- helpers ----
function posBadgeClass(pos: number): string {
  if (pos === 1) return 'bg-yellow-400 text-yellow-900'
  if (pos === 2) return 'bg-gray-300 text-gray-700'
  if (pos === 3) return 'bg-amber-600 text-white'
  return 'bg-gray-100 text-gray-500'
}

const TEAM_COLORS: Record<string, string> = {
  'Mercedes':         '#00D2BE',
  'McLaren':          '#FF8000',
  'Ferrari':          '#DC0000',
  'Red Bull Racing':  '#3671C6',
  'Williams':         '#005AFF',
  'Aston Martin':     '#006F62',
  'Alpine':           '#0090FF',
  'Haas':             '#B6BABD',
  'Kick Sauber':      '#52E252',
  'Racing Bulls':     '#6692FF',
  'AlphaTauri':       '#6692FF',
  'Alfa Romeo':       '#B12335',
}

function TeamDot({ team }: { team: string }) {
  const color = TEAM_COLORS[team] ?? '#9CA3AF'
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  )
}

// ---- custom year dropdown ----
function YearSelect({
  years,
  selected,
  onChange,
}: {
  years: number[]
  selected: number
  onChange: (y: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm transition-all',
          open
            ? 'bg-red-500 text-white border-red-500'
            : 'bg-white text-gray-800 border-gray-200 hover:border-red-400 hover:text-red-500'
        )}
      >
        <span>{selected}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 overflow-hidden min-w-[110px]">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => { onChange(y); setOpen(false) }}
              className={cn(
                'flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium transition-colors',
                y === selected
                  ? 'bg-red-50 text-red-600 font-bold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-red-500'
              )}
            >
              {y === selected && <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />}
              {y !== selected && <span className="h-1.5 w-1.5 rounded-full bg-transparent shrink-0" />}
              {y}
              {y === 2026 && (
                <span className="ml-auto text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">LIVE</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- driver row ----
function DriverRow({ d, isLast }: { d: F1Driver; isLast: boolean }) {
  const color = TEAM_COLORS[d.team] ?? '#9CA3AF'
  return (
    <tr className={cn('hover:bg-gray-50/80 transition-colors', !isLast && 'border-b border-gray-50')}>
      <td className="px-4 py-3 text-center">
        <span className={cn('inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-black', posBadgeClass(d.pos))}>
          {d.pos === 1 ? <Trophy className="h-3.5 w-3.5" /> : d.pos}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1 h-7 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">{d.driver}</div>
            <div className="text-[10px] text-gray-400 font-medium mt-0.5">{d.natCode}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-base">{d.flag}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <TeamDot team={d.team} />
          <span className="text-sm text-gray-600 font-medium">{d.team}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="inline-flex items-center justify-center min-w-10 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs font-black">
          {d.points}
        </span>
      </td>
    </tr>
  )
}

// ---- team row ----
function TeamRow({ t, isLast }: { t: F1Team; isLast: boolean }) {
  return (
    <tr className={cn('hover:bg-gray-50/80 transition-colors', !isLast && 'border-b border-gray-50')}>
      <td className="px-4 py-3 text-center">
        <span className={cn('inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-black', posBadgeClass(t.pos))}>
          {t.pos === 1 ? <Trophy className="h-3.5 w-3.5" /> : t.pos}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-1.5 rounded-full shrink-0"
            style={{ backgroundColor: t.color }}
          />
          <span className="font-bold text-gray-900 text-sm">{t.team}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="inline-flex items-center justify-center min-w-10 px-2 py-1 rounded-lg bg-gray-900 text-white text-xs font-black">
          {t.points}
        </span>
      </td>
    </tr>
  )
}

// ---- schedule card ----
function ScheduleCard({ item }: { item: F1ScheduleRace }) {
  const daysUntil = item.raceIso
    ? Math.round((new Date(item.raceIso).getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className={cn(
      'rounded-2xl border bg-white overflow-hidden transition-all',
      item.status === 'weekend'
        ? 'border-red-300 shadow-lg shadow-red-100'
        : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md',
    )}>
      {/* Race weekend top accent bar */}
      {item.status === 'weekend' && (
        <div className="h-1 w-full bg-linear-to-r from-red-500 to-orange-400" />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          Round {item.round}
        </span>
        {item.status === 'completed' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            ✓ Completed
          </span>
        )}
        {item.status === 'weekend' && (
          <span className="text-[10px] font-black text-white bg-red-500 px-2.5 py-0.5 rounded-full">
            🏁 Race Weekend
          </span>
        )}
        {item.status === 'upcoming' && (
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {daysUntil !== null && daysUntil <= 30
              ? daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`
              : item.raceDate}
          </span>
        )}
      </div>

      {/* GP identity */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-4xl leading-none shrink-0">{item.flag}</span>
        <div className="min-w-0">
          <div className="font-extrabold text-gray-900 text-sm leading-tight truncate">{item.grandPrix}</div>
          <div className="text-[11px] text-gray-400 mt-0.5 truncate">{item.circuit}</div>
        </div>
      </div>

      {/* Session rows */}
      <div className="px-4 pb-3 space-y-1.5 border-t border-gray-50 pt-2.5">
        {item.qualiDate && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Qualifying</span>
            <span className="text-[11px] font-semibold text-gray-600">{item.qualiDate}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Race</span>
          <span className={cn(
            'text-[11px] font-bold',
            item.status === 'weekend' ? 'text-red-500' : 'text-gray-700'
          )}>
            {item.raceDate}
          </span>
        </div>
      </div>

      {/* Bottom: winner (completed) or location (upcoming) */}
      {item.status === 'completed' && item.winner ? (
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-50 bg-gray-50/60">
          <Trophy className="h-3 w-3 text-yellow-500 shrink-0" />
          <span className="text-xs font-bold text-gray-800 truncate">
            {item.winnerFlag} {item.winner}
          </span>
          {item.winnerTeam && (
            <span className="ml-auto text-[10px] text-gray-400 shrink-0 truncate max-w-[100px]">
              {item.winnerTeam}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-gray-50 bg-gray-50/60">
          <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
          <span className="text-[11px] text-gray-400">{item.country}</span>
        </div>
      )}
    </div>
  )
}

// ---- main page ----
export default function Formula1Page() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const data = useMemo(() => f1Data[selectedYear], [selectedYear])
  const isCurrentSeason = selectedYear === 2026

  const schedule = useMemo((): F1ScheduleRace[] => {
    if (selectedYear === 2026) return f1Schedule2026
    return data.races.map((r) => ({
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
  }, [selectedYear, data.races])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 flex items-center justify-center">
            <img src="/f1.png" alt="Formula 1" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Formula 1</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isCurrentSeason
                ? `${selectedYear} Season · ${data.races.length} Races Completed`
                : `${selectedYear} Season · ${data.races.length} Races`}
            </p>
          </div>
        </div>

        {/* Year selector */}
        <YearSelect years={F1_YEARS} selected={selectedYear} onChange={setSelectedYear} />
      </div>

      {/* Season champion banner (past seasons) */}
      {!isCurrentSeason && data.drivers[0] && (
        <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-red-50 to-orange-50 border border-red-100 px-5 py-3.5 mb-6">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{selectedYear} World Champion</div>
            <div className="font-extrabold text-gray-900 text-lg leading-tight">
              {data.drivers[0].flag} {data.drivers[0].driver}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Constructors</div>
            <div className="font-bold text-gray-900 text-sm">{data.teams[0].team}</div>
          </div>
        </div>
      )}

      {/* Live season banner */}
      {isCurrentSeason && (
        <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-red-500 to-red-600 px-5 py-3.5 mb-6 text-white">
          <span className="text-2xl">🏁</span>
          <div>
            <div className="text-[10px] font-bold text-red-100 uppercase tracking-wider">Season Leader</div>
            <div className="font-extrabold text-white text-lg leading-tight">
              {data.drivers[0].flag} {data.drivers[0].driver}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] text-red-100 uppercase tracking-wider">Pts Lead</div>
            <div className="font-extrabold text-white text-lg">
              {data.drivers[0].points - (data.drivers[1]?.points ?? 0)}
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="races">
        <TabsList className="mb-6">
          <TabsTrigger value="races"    className="cursor-pointer">Races</TabsTrigger>
          <TabsTrigger value="drivers"  className="cursor-pointer">Drivers</TabsTrigger>
          <TabsTrigger value="teams"    className="cursor-pointer">Teams</TabsTrigger>
          <TabsTrigger value="schedule" className="cursor-pointer">Schedule</TabsTrigger>
        </TabsList>

        {/* RACES */}
        <TabsContent value="races">
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left w-10 text-xs font-semibold text-gray-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Grand Prix</th>
                  <th className="px-4 py-3 text-left w-24 text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Winner</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
                  <th className="px-4 py-3 text-center w-14 text-xs font-semibold text-gray-400 uppercase">Laps</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.races.map((race, idx) => (
                  <tr
                    key={race.round}
                    className={cn(
                      'transition-colors hover:bg-red-50/30',
                      idx !== data.races.length - 1 && 'border-b border-gray-50'
                    )}
                  >
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-bold text-gray-400 tabular-nums">{race.round}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{race.flag}</span>
                        <div>
                          <div className="font-bold text-gray-900">{race.grandPrix}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[180px]">{race.circuit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{race.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{race.winnerFlag}</span>
                        <span className="font-bold text-gray-900">{race.winner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <TeamDot team={race.team} />
                        <span className="text-sm text-gray-600">{race.team}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-500 tabular-nums">{race.laps}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-mono text-gray-500 tabular-nums whitespace-nowrap">{race.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* DRIVERS */}
        <TabsContent value="drivers">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">
                {selectedYear} Drivers&apos; Championship
              </h3>
              {isCurrentSeason && (
                <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">IN PROGRESS</span>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">Pos.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Driver</th>
                    <th className="px-4 py-3 text-center w-10 text-xs font-semibold text-gray-400 uppercase">Nat.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Pts.</th>
                  </tr>
                </thead>
                <tbody>
                  {data.drivers.map((d, idx) => (
                    <DriverRow key={d.driver} d={d} isLast={idx === data.drivers.length - 1} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TEAMS */}
        <TabsContent value="teams">
          <div className="max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">
                {selectedYear} Constructors&apos; Championship
              </h3>
              {isCurrentSeason && (
                <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">IN PROGRESS</span>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-center w-12 text-xs font-semibold text-gray-400 uppercase">Pos.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Team</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Pts.</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teams.map((t, idx) => (
                    <TeamRow key={t.team} t={t} isLast={idx === data.teams.length - 1} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* SCHEDULE */}
        <TabsContent value="schedule">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{selectedYear} Race Calendar</h3>
            {isCurrentSeason && (
              <div className="hidden sm:flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />Completed
                </span>
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />Race Weekend
                </span>
                <span className="flex items-center gap-1 text-gray-500 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-gray-300 inline-block" />Upcoming
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {schedule.map((item) => (
              <ScheduleCard key={item.round} item={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
