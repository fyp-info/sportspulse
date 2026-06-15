'use client'

import { useState } from 'react'
import { Shield, Bell, AlertTriangle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import RequireAuth from '@/components/auth/RequireAuth'
import { useUserAuth } from '@/lib/store/auth-store'

export default function SettingsPage() {
  const router = useRouter()
  const { setUser } = useUserAuth()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const deleteAccount = async () => {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error ?? 'Could not delete account.')
        return
      }
      // Clear the local session and leave the (now-deleted) account behind.
      setUser(null)
      router.push('/')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <RequireAuth>
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-5">
        {[
          { icon: Shield, title: 'Security & 2FA', desc: 'Password, two-factor authentication', href: '/2fa' },
          { icon: Bell, title: 'Notifications', desc: 'Manage alerts for sports, blog, and legal updates', href: '/settings/notifications' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              {item.href ? (
                <Button variant="outline" size="sm" asChild><Link href={item.href}>Manage</Link></Button>
              ) : (
                <Button variant="outline" size="sm">Configure</Button>
              )}
            </div>
          )
        })}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-600 mb-1">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">Irreversible account actions.</p>
          <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>Delete Account</Button>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !deleting && setConfirming(false)} />

          <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-2xl p-7 sm:p-8">
            {!deleting && (
              <button
                onClick={() => setConfirming(false)}
                className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete your account?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              This permanently deletes your account along with your comments and bookmarks.
              This action <strong>cannot be undone</strong>.
            </p>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600 mb-4">{error}</div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-11" onClick={() => setConfirming(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 h-11" onClick={deleteAccount} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, delete it'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </RequireAuth>
  )
}
