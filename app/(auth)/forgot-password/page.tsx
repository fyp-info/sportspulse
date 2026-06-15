'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  // Step 1: email entry
  const [email, setEmailState] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email')

  // Step 2: code + new password
  const [code, setCode] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>()

  // ── Step 1: request code ──────────────────────────────────────────────────
  const requestCode = async (data: { email: string }) => {
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      const json = await res.json().catch(() => ({}))
      setEmailState(data.email)
      setChallengeId(json.challengeId ?? null)
    } catch {
      // still proceed to code step — API is always 200
    }
    setStep('code')
  }

  // ── Step 2: verify code + set new password ────────────────────────────────
  const verifyCode = async () => {
    setError('')
    if (code.length !== 6) { setError('Enter the 6-digit code from your email.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!challengeId) {
      setError('No reset code was issued for that email. Please try again.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code, password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) { setError(json.error ?? 'Could not reset password.'); return }
      setStep('done')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Password updated</h2>
        <p className="text-gray-500 text-sm mb-6">Your password has been changed. You can now sign in.</p>
        <Button variant="primary" className="w-full" asChild>
          <Link href="/login">Continue to Login</Link>
        </Button>
      </div>
    )
  }

  // ── Step 2: code + new password ───────────────────────────────────────────
  if (step === 'code') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
        <button
          onClick={() => { setStep('email'); setCode(''); setError('') }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Check your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We sent a 6-digit code to <span className="font-medium text-gray-800">{email}</span>. Enter it below along with your new password.
        </p>

        <div className="space-y-4">
          {/* Code */}
          <div className="space-y-2">
            <Label>6-digit code</Label>
            <Input
              autoFocus
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl font-mono tracking-[0.5em] h-14"
              maxLength={6}
            />
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label>New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="Min 8 characters"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label>Confirm new password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') verifyCode() }}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            className="w-full h-11"
            onClick={verifyCode}
            disabled={busy || code.length !== 6 || password.length < 8}
          >
            {busy ? 'Verifying…' : 'Reset Password'}
          </Button>

          <p className="text-center text-xs text-gray-400">
            Didn't receive the code?{' '}
            <button
              type="button"
              className="text-orange-500 hover:underline font-medium"
              onClick={() => { setStep('email'); setCode(''); setError('') }}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  // ── Step 1: email entry ───────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a 6-digit reset code.</p>

      <form onSubmit={handleSubmit(requestCode)} className="space-y-4">
        <div className="space-y-2">
          <Label>Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email', { required: true })}
            />
          </div>
        </div>
        <Button type="submit" variant="primary" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Code'}
        </Button>
      </form>
    </div>
  )
}
