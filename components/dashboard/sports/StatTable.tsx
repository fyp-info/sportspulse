'use client'

import type { ReactNode } from 'react'

interface Props {
  headers: string[]
  rows: (string | number)[][]
  /** indexes of columns to emphasise (e.g. points) */
  highlightCols?: number[]
  rankColumn?: boolean
  empty?: string
}

export default function StatTable({ headers, rows, highlightCols = [], rankColumn = true, empty = 'No data yet.' }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {rankColumn && <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase w-10">#</th>}
            {headers.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                  i === 0 ? 'text-left' : 'text-center'
                } ${highlightCols.includes(i) ? 'text-orange-500' : 'text-gray-400'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length + (rankColumn ? 1 : 0)} className="px-4 py-10 text-center text-sm text-gray-400">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-50 hover:bg-gray-50/60">
              {rankColumn && (
                <td className="px-3 py-2.5">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    ri === 0 ? 'bg-orange-500 text-white' : ri < 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {ri + 1}
                  </span>
                </td>
              )}
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2.5 whitespace-nowrap ${ci === 0 ? 'text-left font-medium text-gray-800' : 'text-center text-gray-600'} ${
                    highlightCols.includes(ci) ? 'font-bold text-orange-600' : ''
                  }`}
                >
                  {cell as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
