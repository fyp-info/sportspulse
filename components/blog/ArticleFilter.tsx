'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const sports = ['All', 'Football', 'Cricket', 'Formula-1']

interface Props {
  onFilter: (filters: { sport: string; search: string }) => void
}

export default function ArticleFilter({ onFilter }: Props) {
  const [sport, setSport] = useState('All')
  const [search, setSearch] = useState('')

  const handleSport = (s: string) => {
    setSport(s)
    onFilter({ sport: s, search })
  }

  const handleSearch = (s: string) => {
    setSearch(s)
    onFilter({ sport, search: s })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sports.map((s) => (
          <button
            key={s}
            onClick={() => handleSport(s)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              sport === s
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
