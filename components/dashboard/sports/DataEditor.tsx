'use client'

import { Plus, Trash2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { round } from '@/lib/sports-calc'

export interface Column<T> {
  key: string
  label: string
  type?: 'text' | 'number'
  /** When set, the cell is read-only and shows this derived value. */
  computed?: (row: T) => number
  decimals?: number
  suffix?: string
  width?: string
  minWidth?: string
  align?: 'left' | 'center'
}

interface Props<T extends { id: string }> {
  columns: Column<T>[]
  rows: T[]
  onChange: (rows: T[]) => void
  makeRow: () => T
  addLabel?: string
  emptyText?: string
}

export default function DataEditor<T extends { id: string }>({
  columns,
  rows,
  onChange,
  makeRow,
  addLabel = 'Add Row',
  emptyText = 'No entries yet. Add your first row to get started.',
}: Props<T>) {
  const update = (id: string, key: string, value: string | number) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)))

  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id))
  const add = () => onChange([...rows, makeRow()])

  const hasComputed = columns.some((c) => c.computed)

  return (
    <div className="space-y-3">
      {hasComputed && (
        <div className="flex items-center gap-1.5 text-xs text-orange-600">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Highlighted columns are auto-calculated from the data you enter.</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-3 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                    c.align === 'center' ? 'text-center' : 'text-left'
                  } ${c.computed ? 'text-orange-500' : 'text-gray-400'}`}
                  style={{ ...(c.width ? { width: c.width } : {}), ...(c.minWidth ? { minWidth: c.minWidth } : {}) }}
                >
                  {c.label}
                  {c.computed && <span className="ml-1 text-[9px] font-bold">AUTO</span>}
                </th>
              ))}
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-gray-400">
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                {columns.map((c) => {
                  if (c.computed) {
                    const val = round(c.computed(row), c.decimals ?? 1)
                    return (
                      <td key={c.key} className={`px-3 py-2 ${c.align === 'center' ? 'text-center' : ''}`}>
                        <span className="inline-block min-w-12 rounded-md bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600">
                          {val}{c.suffix ?? ''}
                        </span>
                      </td>
                    )
                  }
                  return (
                    <td key={c.key} className="px-2 py-1.5" style={c.minWidth ? { minWidth: c.minWidth } : undefined}>
                      <input
                        type={c.type ?? 'text'}
                        value={(row as Record<string, unknown>)[c.key] as string | number}
                        onChange={(e) =>
                          update(row.id, c.key, c.type === 'number' ? Number(e.target.value) : e.target.value)
                        }
                        className={`w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 ${
                          c.type === 'number' ? 'text-center font-medium' : ''
                        }`}
                        {...(c.type === 'number' ? { min: 0 } : {})}
                      />
                    </td>
                  )
                })}
                <td className="px-2 py-1.5 text-center">
                  <button
                    onClick={() => remove(row.id)}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" /> {addLabel}
      </Button>
    </div>
  )
}
