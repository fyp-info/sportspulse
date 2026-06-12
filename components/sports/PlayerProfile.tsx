'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { footballPlayerDetails, type FootballPlayerDetail } from '@/lib/mock-data/football'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function PlayerAvatar({ src, name, className }: { src: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const initials = name.split(' ').map((n) => n[0]).join('')
  if (failed) {
    return (
      <div className={cn('bg-orange-100 flex items-center justify-center font-bold text-orange-600', className)}>
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className={cn('object-cover object-top', className)}
      onError={() => setFailed(true)}
    />
  )
}

function StatBar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400 rounded-full transition-all"
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

function PlayerModal({ player, onClose }: { player: FootballPlayerDetail; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-br from-orange-500 to-orange-600 p-5 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-orange-400/50 border-2 border-white/30 shrink-0">
              <PlayerAvatar src={player.image} name={player.name} className="h-full w-full" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-orange-100 mb-0.5">#{player.jersey}</div>
              <h2 className="text-xl font-extrabold leading-tight">{player.name}</h2>
              <div className="text-sm text-orange-100 mt-0.5">{player.team}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded-full font-medium">{player.position}</span>
                <span className="text-base">{player.flag}</span>
                <span className="text-xs text-orange-100">{player.nationality}</span>
              </div>
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 right-12 bg-white/20 rounded-xl px-2.5 py-1.5 text-center border border-white/20">
            <div className="text-[10px] text-orange-100 font-medium">Rating</div>
            <div className="text-xl font-black leading-none mt-0.5">{player.rating}</div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Season stats grid */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Season Stats</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Apps', value: player.appearances },
                { label: 'Goals', value: player.goals },
                { label: 'Assists', value: player.assists },
                { label: 'Age', value: player.age },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl bg-orange-50 border border-orange-100 p-2.5">
                  <div className="text-lg font-black text-orange-500">{s.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Minutes */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3">
            <span className="text-lg">⏱</span>
            <div>
              <div className="text-sm font-bold text-gray-900">{player.minutesPlayed.toLocaleString()} min</div>
              <div className="text-[10px] text-gray-400">Minutes Played</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-gray-900">{Math.round(player.minutesPlayed / player.appearances)}</div>
              <div className="text-[10px] text-gray-400">Avg. per game</div>
            </div>
          </div>

          {/* Performance bars */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Performance</h3>
            <div className="space-y-3">
              <StatBar label="Pass Accuracy" value={player.passAccuracy} max={100} unit="%" />
              <StatBar label="Shots per Game" value={player.shotsPerGame} max={5} unit="" />
              <StatBar label="Key Passes" value={player.keyPasses} max={5} unit="/g" />
              <StatBar label="Dribbles" value={player.dribbles} max={6} unit="/g" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Discipline</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-7 w-7 bg-yellow-400 rounded text-white text-xs font-bold">{player.yellowCards}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Yellow</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-7 w-7 bg-red-500 rounded text-white text-xs font-bold">{player.redCards}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">Red</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Defensive</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{player.tackles}</div>
                  <div className="text-[9px] text-gray-400">Tackles/g</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-gray-700">{player.interceptions}</div>
                  <div className="text-[9px] text-gray-400">Intcpt/g</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  players?: FootballPlayerDetail[]
}

export default function PlayerProfile({ players = footballPlayerDetails }: Props) {
  const [selected, setSelected] = useState<FootballPlayerDetail | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => setSelected(player)}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all text-left w-full group cursor-pointer"
          >
            {/* Gradient header with avatar + rating */}
            <div className="relative h-20 bg-linear-to-br from-orange-400 to-orange-600">
              <div className="absolute top-2 right-2.5 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-0.5 border border-white/20">
                <span className="text-[9px] font-medium text-orange-50">RTG</span>
                <span className="text-sm font-black text-white leading-none">{player.rating}</span>
              </div>
              <span className="absolute top-2 left-3 text-xs font-black text-white/80">#{player.jersey}</span>
              <div className="absolute -bottom-7 left-4 h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-[3px] border-white shadow-sm">
                <PlayerAvatar src={player.image} name={player.name} className="h-full w-full text-base" />
              </div>
            </div>

            {/* Identity */}
            <div className="pt-9 px-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-500 transition-colors truncate">{player.name}</span>
                <span className="text-sm leading-none shrink-0" title={player.nationality}>{player.flag}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{player.position}</Badge>
                <span className="text-xs text-gray-500 truncate">{player.team}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 px-4">
              {[
                { label: 'Goals', value: player.goals },
                { label: 'Assists', value: player.assists },
                { label: 'Apps', value: player.appearances },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
                  <div className="text-lg font-bold text-orange-500">{stat.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 mb-3 text-center">
              <span className="text-[10px] text-orange-400 font-medium group-hover:text-orange-500 transition-colors">View full stats →</span>
            </div>
          </button>
        ))}
      </div>

      {selected && <PlayerModal player={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
