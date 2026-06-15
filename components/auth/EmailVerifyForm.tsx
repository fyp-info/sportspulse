'use client'

import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AuthUser } from '@/lib/store/auth-store'

interface Props {
  email: string
  onVerified: (user: AuthUser | null) => void
  onBack?: () => void
}

// Inline 6-digit email-verification step. On success the server establishes the
// member session and returns the user, which we hand back to the caller.
export default function EmailVerifyForm({ email, onVerified, onBack }: Props) {
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  const verify = async () => {
    if (code.length !== 6) return
    setVerifying(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Verification failed'); return }
      onVerified(json.user ?? null)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const resend = async () => {
    setError('')
    setResent(false)
    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResent(true)
    } catch { /* ignore */ }
  }

  return (
    <div>
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}
      <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
      <p className="text-gray-500 text-sm mb-6">
        We emailed a 6-digit code to <span className="font-medium text-gray-700">{email}</span>. Enter it below to continue.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Verification Code</Label>
          <Input
            autoFocus
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
            onKeyDown={(e) => { if (e.key === 'Enter') verify() }}
            className="text-center text-2xl font-mono tracking-[0.5em] h-14"
            maxLength={6}
          />
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</div>}
        {resent && <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2.5 text-xs text-green-600">A new code has been sent to your email.</div>}

        <Button variant="primary" className="w-full h-11" onClick={verify} disabled={code.length !== 6 || verifying}>
          {verifying ? 'Verifying…' : 'Verify & Continue'}
        </Button>

        <p className="text-center text-xs text-gray-400">
          Didn&apos;t get a code?{' '}
          <button onClick={resend} className="font-medium text-orange-500 hover:text-orange-600 hover:underline">
            Resend code
          </button>
        </p>
      </div>
    </div>
  )
}
