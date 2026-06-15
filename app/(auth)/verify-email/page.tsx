'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
  }, [searchParams])

  const verify = async () => {
    if (code.length !== 6 || !email) return
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
      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const resend = async () => {
    if (!email) { setError('Enter your email first.'); return }
    setError('')
    setResent(false)
    try {
      await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResent(true)
    } catch {
      /* ignore */
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
        <p className="text-gray-500 text-sm mb-6">Your account has been verified. You can now sign in.</p>
        <Button variant="primary" asChild className="w-full"><Link href="/login">Continue to Login</Link></Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
      <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
      <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code we emailed you. It expires in 24 hours.</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
          />
        </div>

        <div className="space-y-2">
          <Label>Verification Code</Label>
          <Input
            autoFocus
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={(e) => { if (e.key === 'Enter') verify() }}
            className="text-center text-2xl font-mono tracking-[0.5em] h-14"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</div>
        )}
        {resent && (
          <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2.5 text-xs text-green-600">
            A new code has been sent to your email.
          </div>
        )}

        <Button variant="primary" className="w-full h-11" onClick={verify} disabled={code.length !== 6 || !email || verifying}>
          {verifying ? 'Verifying…' : 'Verify Email'}
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
