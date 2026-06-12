import type { ElementType } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  icon: ElementType
  change?: number
  changeLabel?: string
  color?: string
}

export default function StatCard({ title, value, icon: Icon, change, changeLabel, color = 'text-orange-500' }: Props) {
  const isPositive = change === undefined || change >= 0
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
          <p className={cn('text-2xl font-bold mt-1', color)}>{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
          <Icon className={cn('h-5 w-5', color)} />
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
          )}
          <span className={cn('text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
