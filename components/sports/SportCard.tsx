import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const sports = [
  { name: 'Football', href: '/sports/football', emoji: '⚽', desc: 'Premier League, UCL, La Liga & more', bg: 'from-green-50 to-emerald-50', border: 'hover:border-green-300 hover:shadow-green-100' },
  { name: 'Cricket', href: '/sports/cricket', emoji: '🏏', desc: 'Test, ODI, T20 & ICC tournaments', bg: 'from-blue-50 to-sky-50', border: 'hover:border-blue-300 hover:shadow-blue-100' },
  { name: 'Formula-1', href: '/sports/formula-1', emoji: '🏎️', desc: 'Race results, standings & driver profiles', bg: 'from-red-50 to-rose-50', border: 'hover:border-red-300 hover:shadow-red-100' },
  { name: 'Basketball', href: '/sports/basketball', emoji: '🏀', desc: 'NBA, FIBA & international basketball', bg: 'from-orange-50 to-amber-50', border: 'hover:border-orange-300 hover:shadow-orange-100' },
]

export default function SportCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sports.map((sport) => (
        <Link
          key={sport.name}
          href={sport.href}
          className={`group rounded-2xl border border-gray-100 bg-linear-to-br ${sport.bg} p-5 transition-all duration-200 shadow-sm hover:shadow-md ${sport.border}`}
        >
          <div className="text-4xl mb-3">{sport.emoji}</div>
          <div className="font-semibold text-gray-900 group-hover:text-gray-900">{sport.name}</div>
          <div className="text-xs text-gray-500 mt-1 leading-relaxed">{sport.desc}</div>
          <div className="flex items-center gap-1 text-xs text-orange-500 mt-3 group-hover:gap-2 transition-all font-medium">
            Explore <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      ))}
    </div>
  )
}
