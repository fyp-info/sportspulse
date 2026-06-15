'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MailWarning, X } from 'lucide-react'
import { useUserAuth } from '@/lib/store/auth-store'

// Thin reminder shown to signed-in users who haven't verified their email.
// Login is NOT blocked — this is just a nudge with a resend action.
export default function VerifyEmailBanner() {
  const { user, isAuthenticated } = useUserAuth()
  const [dismissed, setDismissed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  if (!isAuthenticated || !user || user.emailVerified || dismissed) return null

  const resend = async () => {
    setStatus('sending')
    try {
      await fetch('/api/auth/resend-verification', { method: 'POST' })
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <MailWarning className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-amber-800 flex-1 min-w-0">
          Please verify your email address.{' '}
          {status === 'sent' ? (
            <>
              Code sent —{' '}
              <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`} className="font-semibold underline hover:text-amber-900">
                enter it here
              </Link>
              .
            </>
          ) : (
            <button
              onClick={resend}
              disabled={status === 'sending'}
              className="font-semibold underline hover:text-amber-900 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send verification code'}
            </button>
          )}
        </p>
        <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-700 shrink-0" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
