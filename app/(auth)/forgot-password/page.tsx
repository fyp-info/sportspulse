'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, getValues } = useForm<{ email: string }>()

  const onSubmit = () => setSent(true)

  if (sent) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm mb-1">We sent a password reset link to:</p>
        <p className="text-orange-500 font-medium text-sm mb-5">{getValues('email')}</p>
        <p className="text-xs text-gray-400 mb-6">Didn't receive it? Check your spam folder or try again.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setSent(false)}>Try Again</Button>
          <Button variant="primary" className="flex-1" asChild><Link href="/login">Back to Login</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot password?</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Email address</Label>
          <Input type="email" placeholder="you@example.com" {...register('email', { required: true })} />
        </div>
        <Button type="submit" variant="primary" className="w-full">Send Reset Link</Button>
      </form>
    </div>
  )
}
