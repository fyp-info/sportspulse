'use client'

import Link from 'next/link'
import { ChevronRight, Database } from 'lucide-react'

const categories = [
  { slug: 'football',   name: 'Football',   emoji: '⚽', color: 'from-emerald-500 to-green-600',  tabs: 'Scores · Standings · Players · Schedule · Tournament' },
  { slug: 'cricket',    name: 'Cricket',    emoji: '🏏', color: 'from-sky-500 to-blue-600',      tabs: 'Scores · Standings · Players · Schedule · Tournament' },
  { slug: 'formula-1',  name: 'Formula 1',  emoji: '🏎️', color: 'from-red-500 to-rose-600',      tabs: 'Races · Drivers · Teams · Schedule' },
]

export default function SportsHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sports Data</h1>
        <p className="text-gray-500 text-sm mt-1">Choose a category to manage its data. Standings & stats are calculated automatically.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`sports/${c.slug}`}
            className="group rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-2xl bg-linear-to-br ${c.color} flex items-center justify-center text-3xl shadow-sm`}>
                {c.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{c.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Database className="h-3 w-3" /> {c.tabs}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
