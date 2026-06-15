'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useUserAuth, type AuthUser } from '@/lib/store/auth-store'
import { roleHome, type Role } from '@/lib/auth/roles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EmailVerifyForm from '@/components/auth/EmailVerifyForm'

interface FormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, setUser } = useUserAuth()
  const [showPw, setShowPw] = useState(false)
  const [loginError, setLoginError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  // 2FA second step
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  // Email-verification second step (unverified account logging in)
  const [verifyEmail, setVerifyEmail] = useState('')

  const goNext = (role: Role) => {
    const next = searchParams.get('next')
    router.push(next || roleHome(role))
  }

  const onSubmit = async (data: FormData) => {
    setLoginError('')
    const result = await login(data.email, data.password, 'user')
    if (!result.ok) {
      setLoginError(result.error ?? 'Login failed')
      return
    }
    if (result.needsVerification) {
      setVerifyEmail(result.email ?? data.email)
      return
    }
    if (result.twoFactor && result.challengeId) {
      setChallengeId(result.challengeId)
      setCode('')
      return
    }
    if (result.user) goNext(result.user.role as Role)
  }

  const onVerified = (user: AuthUser | null) => {
    if (user) {
      setUser(user)
      router.push('/profile')
    } else {
      setVerifyEmail('')
    }
  }

  const verifyCode = async () => {
    if (!challengeId || code.length !== 6) return
    setVerifying(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code }),
      })
      const json = await res.json()
      if (!res.ok) { setLoginError(json.error ?? 'Incorrect code'); return }
      setUser(json.user)
      goNext(json.user.role as Role)
    } catch {
      setLoginError('Network error. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  if (verifyEmail) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        <EmailVerifyForm email={verifyEmail} onVerified={onVerified} onBack={() => setVerifyEmail('')} />
      </div>
    )
  }

  if (challengeId) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        <button onClick={() => { setChallengeId(null); setLoginError('') }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter your code</h1>
        <p className="text-gray-500 text-sm mb-6">Two-factor authentication is on. We emailed you a 6-digit code.</p>
        <Input
          autoFocus
          inputMode="numeric"
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={(e) => { if (e.key === 'Enter') verifyCode() }}
          className="text-center text-2xl font-mono tracking-[0.5em] h-14"
          maxLength={6}
        />
        {loginError && <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{loginError}</div>}
        <Button variant="primary" className="w-full h-11 mt-4" onClick={verifyCode} disabled={code.length !== 6 || verifying}>
          {verifying ? 'Verifying…' : 'Verify & Sign In'}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1.5">Sign in to pick up where you left off</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
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
          <Link href="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline">Forgot password?</Link>
        </div>

        {loginError && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
            {loginError}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-7">
        Don't have an account?{' '}
        <Link href="/register" className="text-orange-500 hover:text-orange-600 hover:underline font-semibold">Sign up free</Link>
      </p>
    </div>
  )
}
