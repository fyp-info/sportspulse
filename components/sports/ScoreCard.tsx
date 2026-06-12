import { recentScores } from '@/lib/mock-data/sports'
import { Badge } from '@/components/ui/badge'

const sportVariants: Record<string, 'football' | 'basketball' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  Basketball: 'basketball',
  F1: 'formula-1',
  Cricket: 'cricket',
}

interface Props {
  sport?: string
}

export default function ScoreCard({ sport }: Props) {
  const scores = sport
    ? recentScores.filter((s) => s.sport === sport)
    : recentScores

  return (
    <div className="flex flex-col gap-3">
      {scores.map((score) => (
        <div key={score.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={sportVariants[score.sport] ?? 'default'} className="text-[10px]">{score.competition}</Badge>
            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">{score.status}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-800 flex-1 text-right">{score.homeTeam}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xl font-black text-gray-900">{score.homeScore}</span>
              <span className="text-gray-300 text-sm">-</span>
              <span className="text-xl font-black text-gray-900">{score.awayScore}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 flex-1">{score.awayTeam}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
