'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      {password && <p className={`text-xs font-medium ${['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-600'][strength]}`}>{label}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const password = watch('password', '')

  const onSubmit = () => setSuccess(true)

  if (success) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
        <p className="text-gray-500 text-sm mb-4">Check your email to verify your account.</p>
        <Button variant="primary" asChild><Link href="/login">Go to Login</Link></Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 text-sm mt-1">Join SportsPulse today — it's free</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input placeholder="johndoe" {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min 3 characters' } })} />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" {...register('password', { required: true, minLength: { value: 8, message: 'Min 8 characters' } })} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>
        <div className="space-y-2">
          <Label>Confirm Password</Label>
          <Input type="password" placeholder="••••••••" {...register('confirmPassword', {
            validate: (v) => v === password || 'Passwords do not match'
          })} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-orange-500" {...register('terms', { required: 'You must accept terms' })} />
          <span className="text-xs text-gray-500">
            I agree to the <Link href="#" className="text-orange-500 hover:underline">Terms of Service</Link> and{' '}
            <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

        <Button type="submit" variant="primary" className="w-full">Create Account</Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-orange-500 hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
