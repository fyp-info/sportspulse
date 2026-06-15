'use client'

import { useState } from 'react'
import { Shield, Check, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import RequireAuth from '@/components/auth/RequireAuth'
import { useUserAuth } from '@/lib/store/auth-store'

function TwoFAInner() {
  const { user, setUser } = useUserAuth()
  const enabled = !!user?.twoFactorEnabled

  const [step, setStep] = useState<'idle' | 'confirm'>('idle')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  const maskedEmail = user?.email ? user.email.replace(/^(.{2}).*(@.*)$/, (_m, a, b) => `${a}${'•'.repeat(4)}${b}`) : 'your email'

  const startEnable = async () => {
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Could not start setup'); return }
      setStep('confirm')
      setCode('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const confirmEnable = async () => {
    if (code.length !== 6) return
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Verification failed'); return }
      if (user) setUser({ ...user, twoFactorEnabled: true })
      setStep('idle')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/auth/2fa/disable', { method: 'POST' })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Could not disable'); return }
      if (user) setUser({ ...user, twoFactorEnabled: false })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const onToggle = (next: boolean) => {
    if (busy) return
    if (next) startEnable()
    else disable()
  }

  const resend = async () => {
    setResent(false)
    await fetch('/api/auth/2fa/setup', { method: 'POST' }).catch(() => {})
    setResent(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h1>
            <p className="text-xs text-gray-500">Protect your account with an email code at sign-in</p>
          </div>
        </div>

        {step === 'confirm' ? (
          <div className="space-y-5">
            <button onClick={() => { setStep('idle'); setError('') }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </button>
            <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 flex items-start gap-3">
              <Mail className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                We emailed a 6-digit code to <span className="font-medium text-gray-800">{maskedEmail}</span>. Enter it below to turn on 2FA.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input
                autoFocus
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmEnable() }}
                className="text-center text-2xl font-mono tracking-[0.5em] h-14"
                maxLength={6}
              />
            </div>
            {error && <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</div>}
            {resent && <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2.5 text-xs text-green-600">A new code has been sent.</div>}
            <Button variant="primary" className="w-full h-11" onClick={confirmEnable} disabled={code.length !== 6 || busy}>
              {busy ? 'Verifying…' : 'Verify & Enable 2FA'}
            </Button>
            <p className="text-center text-xs text-gray-400">
              Didn&apos;t get it?{' '}
              <button onClick={resend} className="font-medium text-orange-500 hover:text-orange-600 hover:underline">Resend code</button>
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Enable 2FA</p>
                <p className="text-xs text-gray-500">
                  {enabled ? 'Active — a code is emailed each time you sign in.' : 'Currently disabled'}
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={onToggle} disabled={busy} />
            </div>

            {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</div>}

            {enabled && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">2FA is on</p>
                  <p className="text-xs text-gray-500">Each sign-in will require a 6-digit code sent to your email.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function TwoFAPage() {
  return (
    <RequireAuth>
      <TwoFAInner />
    </RequireAuth>
  )
}
