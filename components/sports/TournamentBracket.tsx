'use client'

import type { ReactNode } from 'react'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BracketRenderers {
  renderCrest?: (key: string) => ReactNode
  renderLabel?: (key: string) => string
}

export interface BracketMatch {
  date: string
  home: string | null
  away: string | null
  homeScore?: string | number | null
  awayScore?: string | number | null
  winner?: 'home' | 'away' | null
}

export interface BracketRound {
  title: string
  matches: BracketMatch[]
}

// ---- crest (flag emoji for nations, colored initials for clubs) ----
function leadingFlag(name: string): string | null {
  const m = name.match(/^(\p{Regional_Indicator}{2})/u)
  return m ? m[1] : null
}
function stripFlag(name: string): string {
  return name.replace(/^(?:\p{Regional_Indicator}{2})\s*/u, '')
}
const CREST_COLORS = [
  'from-orange-400 to-orange-600',
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-cyan-500 to-cyan-700',
  'from-amber-400 to-amber-600',
  'from-indigo-400 to-indigo-600',
]
function crestColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return CREST_COLORS[h % CREST_COLORS.length]
}

function Crest({ name }: { name: string | null }) {
  if (!name) {
    return (
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-400 shrink-0">
        <Shield className="h-3.5 w-3.5" />
      </span>
    )
  }
  const flag = leadingFlag(name)
  if (flag) {
    return (
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-50 border border-gray-200 text-base shrink-0">
        {flag}
      </span>
    )
  }
  const initials = stripFlag(name).split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className={cn('inline-flex items-center justify-center h-6 w-6 rounded-full bg-linear-to-br text-white font-bold text-[9px] shrink-0', crestColor(name))}>
      {initials}
    </span>
  )
}

function TeamRow({ name, score, win, renderCrest, renderLabel }: {
  name: string | null
  score?: string | number | null
  win?: boolean
} & BracketRenderers) {
  return (
    <div className="flex items-center gap-2 py-1">
      {name && renderCrest ? renderCrest(name) : <Crest name={name} />}
      <span className={cn('flex-1 text-xs truncate', win ? 'font-bold text-gray-900' : name ? 'text-gray-600' : 'text-gray-400')}>
        {name ? (renderLabel ? renderLabel(name) : stripFlag(name)) : 'TBD'}
      </span>
      {score !== undefined && score !== null && score !== '' && (
        <span className={cn('text-xs font-black tabular-nums shrink-0', win ? 'text-gray-900' : 'text-gray-400')}>{score}</span>
      )}
    </div>
  )
}

function MatchCard({ match, renderCrest, renderLabel }: { match: BracketMatch } & BracketRenderers) {
  return (
    <div className="w-44 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 shadow-sm hover:border-orange-200 hover:bg-white transition-colors">
      <div className="text-[10px] text-gray-400 mb-1 font-medium">{match.date}</div>
      <TeamRow name={match.home} score={match.homeScore} win={match.winner === 'home'} renderCrest={renderCrest} renderLabel={renderLabel} />
      <div className="h-px bg-gray-100" />
      <TeamRow name={match.away} score={match.awayScore} win={match.winner === 'away'} renderCrest={renderCrest} renderLabel={renderLabel} />
    </div>
  )
}

function Connectors({ count }: { count: number }) {
  return (
    <div className="flex flex-col w-8 shrink-0">
      <div className="h-9 shrink-0" />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative flex-1">
          {/* incoming bracket: joins the pair above + below */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-1/2 border-t-2 border-b-2 border-r-2 border-gray-200 rounded-r-md" />
          {/* outgoing line into next round */}
          <div className="absolute right-0 top-1/2 w-1/2 border-t-2 border-gray-200" />
        </div>
      ))}
    </div>
  )
}

export default function TournamentBracket({ rounds, renderCrest, renderLabel }: { rounds: BracketRound[] } & BracketRenderers) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex items-stretch w-max mx-auto">
        {rounds.map((round, ri) => (
          <div key={round.title} className="flex">
            {/* round column */}
            <div className="flex flex-col">
              <h4 className="h-9 flex items-center justify-center text-sm font-semibold text-gray-500 px-2">
                {round.title}
              </h4>
              {round.matches.map((m, mi) => (
                <div key={mi} className="flex-1 flex items-center min-h-32 px-1">
                  <MatchCard match={m} renderCrest={renderCrest} renderLabel={renderLabel} />
                </div>
              ))}
            </div>
            {/* connector to next round */}
            {ri < rounds.length - 1 && <Connectors count={rounds[ri + 1].matches.length} />}
          </div>
        ))}
      </div>
    </div>
  )
}
