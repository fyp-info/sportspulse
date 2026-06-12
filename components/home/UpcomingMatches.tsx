import { Calendar, MapPin, Clock } from 'lucide-react'
import { upcomingMatches } from '@/lib/mock-data/sports'
import { Badge } from '@/components/ui/badge'

const sportVariants: Record<string, 'football' | 'basketball' | 'formula-1' | 'cricket'> = {
  Football: 'football',
  Basketball: 'basketball',
  F1: 'formula-1',
  Cricket: 'cricket',
}

export default function UpcomingMatches() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Upcoming Matches</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{upcomingMatches.length} events</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {upcomingMatches.map((match) => (
          <div
            key={match.id}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant={sportVariants[match.sport] ?? 'default'}>{match.sport}</Badge>
              <span className="text-xs text-gray-400">{match.competition}</span>
            </div>

            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="font-semibold text-gray-800 text-sm text-center flex-1">{match.homeTeam}</span>
              <span className="text-xs font-bold text-orange-500 px-2 py-1 rounded-lg bg-orange-50">VS</span>
              <span className="font-semibold text-gray-800 text-sm text-center flex-1">{match.awayTeam}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {match.time}
              </span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{match.venue}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
