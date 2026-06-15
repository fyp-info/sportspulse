'use client'

import { useState, useEffect } from 'react'
import { Power, Wrench, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MaintenanceToggle() {
  const [on, setOn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/maintenance', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setOn(!!d.maintenance))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const apply = async (next: boolean) => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ on: next }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error ?? 'Failed to update')
      setOn(!!j.maintenance)
      setConfirming(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  const handleClick = () => {
    if (on) {
      apply(false) // turning OFF is safe — no confirm needed
    } else {
      setConfirming(true) // turning ON takes the site down — confirm first
    }
  }

  if (loading) {
    return <div className="h-9 w-44 rounded-xl bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        {on && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Website is OFFLINE
          </span>
        )}
        <Button
          variant={on ? 'destructive' : 'outline'}
          size="sm"
          onClick={handleClick}
          disabled={saving}
          className={on ? '' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}
        >
          {on ? <Power className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
          {saving ? 'Updating…' : on ? 'Turn Website Back On' : 'Maintenance Mode'}
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {confirming && (
        <div className="w-72 rounded-xl border border-orange-200 bg-orange-50 p-3 text-left shadow-sm">
          <div className="flex items-start gap-2 mb-2.5">
            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-800 leading-relaxed">
              This takes the <strong>public website offline</strong> for all visitors — they&apos;ll only see a
              maintenance card. Dashboards stay accessible. Continue?
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setConfirming(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="flex-1 h-8 text-xs" onClick={() => apply(true)} disabled={saving}>
              {saving ? 'Enabling…' : 'Take Site Down'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
