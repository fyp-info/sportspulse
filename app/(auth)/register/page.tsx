'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import EmailVerifyForm from '@/components/auth/EmailVerifyForm'
import { useUserAuth, type AuthUser } from '@/lib/store/auth-store'

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const strength = checks.filter(Boolean).length
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      {password && <p className={`text-xs font-medium ${['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-600'][strength]}`}>{label} password</p>}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useUserAuth()
  const [showPw, setShowPw] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>()
  const password = watch('password', '')

  const onSubmit = async (data: FormData) => {
    setSubmitError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSubmitError(json.error ?? 'Registration failed')
        return
      }
      // Show the inline 6-digit code box right here.
      setPendingEmail(data.email)
    } catch {
      setSubmitError('Network error. Please try again.')
    }
  }

  const onVerified = (user: AuthUser | null) => {
    if (user) {
      setUser(user)
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }

  // After a successful registration, swap the form for the code-entry step.
  if (pendingEmail) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        <EmailVerifyForm email={pendingEmail} onVerified={onVerified} onBack={() => setPendingEmail('')} />
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1.5">Join SportsPulse today — it's free</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="johndoe"
              className="pl-10"
              {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })}
            />
          </div>
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password', { required: true, minLength: { value: 8, message: 'Min 8 characters' } })}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register('confirmPassword', { validate: (v) => v === password || 'Passwords do not match' })}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-orange-500 shrink-0" {...register('terms', { required: 'You must accept terms' })} />
          <span className="text-xs text-gray-500 leading-relaxed">
            I agree to the <Link href="#" className="text-orange-500 hover:underline font-medium">Terms of Service</Link> and{' '}
            <Link href="#" className="text-orange-500 hover:underline font-medium">Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

        {submitError && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">
            {submitError}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full h-11 mt-1" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-7">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-500 hover:text-orange-600 hover:underline font-semibold">Sign in</Link>
      </p>
    </div>
  )
}
