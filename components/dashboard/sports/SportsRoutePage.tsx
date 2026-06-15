'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import SportsManager, { type SportKey } from './SportsManager'

const valid: SportKey[] = ['football', 'cricket', 'formula-1']

export default function SportsRoutePage() {
  const params = useParams<{ sport: string }>()
  const sport = params?.sport

  if (!sport || !valid.includes(sport as SportKey)) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center">
        <p className="text-gray-500 mb-4">Unknown sport category.</p>
        <Link href=".." className="text-orange-500 hover:underline text-sm font-medium">Back to Sports</Link>
      </div>
    )
  }

  return <SportsManager sport={sport as SportKey} />
}
