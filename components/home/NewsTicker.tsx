'use client'

import { Radio } from 'lucide-react'

const tickerItems = [
  'BREAKING: Arsenal qualify for UCL Final',
  'Verstappen extends F1 championship lead after Monaco GP',
  "India take control at Lord's on Day 3",
  'Premier League title race: City, Arsenal, Liverpool separated by 5 points',
  'Mbappé scores hat-trick in Real Madrid derby',
]

export default function NewsTicker() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 shrink-0">
        <Radio className="h-4 w-4 text-white animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Live</span>
      </div>
      <div className="overflow-hidden flex-1 py-2.5">
        <div className="flex gap-12 animate-[ticker_30s_linear_infinite] whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-sm text-gray-600 shrink-0">
              <span className="text-orange-400 mr-2">●</span>{item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
