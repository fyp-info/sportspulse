'use client'

import { useState, useEffect } from 'react'
import { Bell, Trophy, PenSquare, Scale, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Toast from '@/components/dashboard/Toast'
import RequireAuth from '@/components/auth/RequireAuth'

type Toggle = { id: string; icon: typeof Bell; color: string; bg: string; title: string; desc: string; enabled: boolean }

const DEFAULTS: Toggle[] = [
  {
    id: 'sports',
    icon: Trophy,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
    title: 'Sports Updates',
    desc: 'Match results, standings changes, and live score alerts.',
    enabled: true,
  },
  {
    id: 'blog',
    icon: PenSquare,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    title: 'New Articles',
    desc: 'Get notified when a new blog post or match report is published.',
    enabled: true,
  },
  {
    id: 'legal',
    icon: Scale,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
    title: 'Legal Updates',
    desc: 'Privacy Policy and Terms of Service changes.',
    enabled: true,
  },
  {
    id: 'system',
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-100',
    title: 'Security & System',
    desc: 'Login alerts, suspicious activity, and account security notices.',
    enabled: true,
  },
]

export default function NotificationSettingsPage() {
  const [toggles, setToggles] = useState<Toggle[]>(DEFAULTS)
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  // Load saved preferences.
  useEffect(() => {
    let cancelled = false
    fetch('/api/settings/notifications', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (cancelled || !d.prefs) return
        setToggles(prev => prev.map(t => ({ ...t, enabled: d.prefs[t.id] ?? t.enabled })))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const flip = (id: string) =>
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t))

  const enableAll = () => setToggles(prev => prev.map(t => ({ ...t, enabled: true })))
  const disableAll = () => setToggles(prev => prev.map(t => ({ ...t, enabled: false })))

  const handleSave = async () => {
    setSaving(true)
    const prefs = Object.fromEntries(toggles.map(t => [t.id, t.enabled]))
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      setToast(res.ok ? 'Notification preferences saved.' : 'Could not save preferences.')
    } catch {
      setToast('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const allOn = toggles.every(t => t.enabled)
  const allOff = toggles.every(t => !t.enabled)

  return (
    <RequireAuth>
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back */}
      <Link href="/settings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Settings
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Choose which updates you want to receive.</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={enableAll}
          disabled={allOn}
          className="text-xs font-medium text-orange-500 hover:text-orange-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Enable all
        </button>
        <span className="text-gray-300">·</span>
        <button
          onClick={disableAll}
          disabled={allOff}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Disable all
        </button>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-6">
        {toggles.map((t) => {
          const Icon = t.icon
          return (
            <div
              key={t.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:border-orange-200 transition-all"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${t.bg}`}>
                <Icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{t.title}</p>
                <p className="text-sm text-gray-500 leading-snug">{t.desc}</p>
              </div>
              {/* Toggle switch */}
              <button
                role="switch"
                aria-checked={t.enabled}
                onClick={() => flip(t.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  t.enabled ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    t.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>

      {/* Save */}
      <Button variant="primary" className="w-full h-11" onClick={handleSave} disabled={saving}>
        <CheckCircle2 className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Preferences'}
      </Button>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
    </RequireAuth>
  )
}
