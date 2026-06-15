'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock, ShieldCheck, X, Check, Mail, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useStaffAuth } from '@/lib/store/auth-store'
import { roleHome, type Role } from '@/lib/auth/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginForm {
  identifier: string
  password: string
}

interface ResetForm {
  email: string
  fullName: string
  message: string
}

export default function StaffLoginPage() {
  const router = useRouter()
  const setUser = useStaffAuth((s) => s.setUser)
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showReset, setShowReset] = useState(false)

  // Two-step: credentials → emailed 6-digit code → dashboard.
  const [step, setStep] = useState<'password' | 'code'>('password')
  const [challengeId, setChallengeId] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  // Step 1 — verify credentials and email a login code.
  const onPasswordSubmit = async (data: LoginForm) => {
    setLoginError('')
    try {
      const res = await fetch('/api/auth/2fa/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier.trim(), password: data.password, scope: 'staff' }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLoginError(json.error ?? 'No staff account found with those credentials.')
        return
      }
      setChallengeId(json.challengeId)
      setMaskedEmail(maskEmail(data.identifier.trim()))
      setCode('')
      setStep('code')
    } catch {
      setLoginError('Network error. Please try again.')
    }
  }

  // Step 2 — verify the emailed code, then enter the dashboard.
  const onCodeSubmit = async () => {
    if (code.length !== 6) return
    setVerifying(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLoginError(json.error ?? 'Incorrect code')
        setVerifying(false)
        return
      }
      setUser(json.user)
      router.push(roleHome(json.user.role as Role))
    } catch {
      setLoginError('Network error. Please try again.')
      setVerifying(false)
    }
  }

  const resend = async () => {
    setLoginError('')
    const { identifier, password } = getValues()
    try {
      const res = await fetch('/api/auth/2fa/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password, scope: 'staff' }),
      })
      const json = await res.json()
      if (res.ok) setChallengeId(json.challengeId)
    } catch { /* ignore */ }
  }

  return (
    <>
      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
            <ShieldCheck className="h-5 w-5 text-orange-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">Staff Portal</span>
        </div>

        {step === 'password' ? (
          <>
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to your dashboard</h1>
              <p className="text-gray-500 text-sm mt-1.5">For editors, moderators and admins</p>
            </div>

            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Username or Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="identifier"
                    placeholder="Enter username or email"
                    className="pl-10"
                    {...register('identifier', { required: 'This field is required' })}
                  />
                </div>
                {errors.identifier && <p className="text-xs text-red-500">{errors.identifier.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="pl-10 pr-10"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-xs font-medium text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
                  {loginError}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? 'Sending code…' : 'Continue'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <button
              onClick={() => { setStep('password'); setCode(''); setLoginError('') }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="mb-6">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Enter verification code</h1>
              <p className="text-gray-500 text-sm mt-1.5">
                We emailed a 6-digit code to <span className="font-medium text-gray-700">{maskedEmail}</span>. It expires in 10 minutes.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                autoFocus
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => { if (e.key === 'Enter') onCodeSubmit() }}
                className="text-center text-2xl font-mono tracking-[0.5em] h-14"
                maxLength={6}
              />

              {loginError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
                  {loginError}
                </div>
              )}

              <Button variant="primary" className="w-full h-11" onClick={onCodeSubmit} disabled={code.length !== 6 || verifying}>
                {verifying ? 'Verifying…' : 'Verify & Sign In'}
              </Button>

              <p className="text-center text-xs text-gray-400">
                Didn&apos;t get it?{' '}
                <button onClick={resend} className="font-medium text-orange-500 hover:text-orange-600 hover:underline">
                  Resend code
                </button>
              </p>
            </div>
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">Secure area. Authorized access only.</p>
      </div>

      {showReset && <ResetRequestModal onClose={() => setShowReset(false)} />}
    </>
  )
}

function maskEmail(identifier: string): string {
  if (!identifier.includes('@')) return 'your email'
  const [name, domain] = identifier.split('@')
  const shown = name.slice(0, 2)
  return `${shown}${'•'.repeat(Math.max(name.length - 2, 1))}@${domain}`
}

function ResetRequestModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>()

  const onSubmit = async (data: ResetForm) => {
    // Always succeeds (the API won't reveal whether the account exists).
    try {
      await fetch('/api/password-reset-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, fullName: data.fullName, message: data.message }),
      })
    } catch {
      /* still show confirmation */
    }
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-2xl p-7 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request sent</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password reset request has been sent to the Super Admin. You'll be contacted once it's reviewed.
            </p>
            <Button variant="primary" className="w-full h-11" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Password Reset Request</h2>
              <p className="text-gray-500 text-sm mt-1.5">Send your password reset request to Super Admin.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter your full name"
                  {...register('fullName', { required: 'Full name is required' })}
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Request Message <span className="text-gray-400 font-normal">(optional)</span></Label>
                <textarea
                  rows={3}
                  placeholder="Why are you requesting reset?"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                  {...register('message')}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-11" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1 h-11" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
