'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock, Crown, Mail, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useStaffAuth } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginForm {
  identifier: string
  password: string
}

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const setUser = useStaffAuth((s) => s.setUser)
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Two-step: 'password' → email code → 'code'
  const [step, setStep] = useState<'password' | 'code'>('password')
  const [challengeId, setChallengeId] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onPasswordSubmit = async (data: LoginForm) => {
    setLoginError('')
    try {
      const res = await fetch('/api/auth/2fa/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: data.identifier.trim(), password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLoginError(json.error ?? 'Invalid credentials')
        return
      }
      setChallengeId(json.challengeId)
      setMaskedEmail(maskEmail(data.identifier.trim()))
      setStep('code')
    } catch {
      setLoginError('Network error. Please try again.')
    }
  }

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
      router.push('/dashboard/superadmin/profile')
    } catch {
      setLoginError('Network error. Please try again.')
      setVerifying(false)
    }
  }

  const resend = async () => {
    setLoginError('')
    const { identifier, password } = getValues()
    const res = await fetch('/api/auth/2fa/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier.trim(), password }),
    })
    const json = await res.json()
    if (res.ok) setChallengeId(json.challengeId)
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
          <Crown className="h-5 w-5 text-orange-500" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">Super Admin</span>
      </div>

      {step === 'password' ? (
        <>
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Super Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1.5">Sign in with Super Admin credentials</p>
          </div>

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username or Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="identifier"
                  placeholder="Enter super admin email"
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
                <Link
                  href="/pulsekk97G18-7-0-9P2-adminn/PulSe-K-Superr/verify"
                  className="text-xs font-medium text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Forgot password?
                </Link>
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
  )
}

function maskEmail(identifier: string): string {
  if (!identifier.includes('@')) return 'your email'
  const [name, domain] = identifier.split('@')
  const shown = name.slice(0, 2)
  return `${shown}${'•'.repeat(Math.max(name.length - 2, 1))}@${domain}`
}
