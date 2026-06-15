'use client'

import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Mail, Check, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Step = 'email' | 'code' | 'done'

interface EmailForm {
  email: string
}

export default function SuperAdminVerifyPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  if (step === 'email') {
    return <EmailStep onNext={(e) => { setEmail(e); setStep('code') }} />
  }
  if (step === 'code') {
    return (
      <CodeStep
        email={email}
        onBack={() => setStep('email')}
        onVerified={() => setStep('done')}
      />
    )
  }
  return <DoneStep onContinue={() => router.push('/pulsekk97G18-7-0-9P2-adminn/PulSe-K-Superr/login')} />
}

function EmailStep({ onNext }: { onNext: (email: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailForm>()

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
          <ShieldCheck className="h-5 w-5 text-orange-500" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">Super Admin</span>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Super Admin Verification</h1>
        <p className="text-gray-500 text-sm mt-1.5">Enter your email to receive a verification code.</p>
      </div>

      <form onSubmit={handleSubmit((d) => onNext(d.email))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter super admin email"
              className="pl-10"
              {...register('email', { required: 'Email is required' })}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button type="submit" variant="primary" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Verification Code'}
        </Button>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/pulsekk97G18-7-0-9P2-adminn/PulSe-K-Superr/login"
          className="text-xs font-medium text-gray-500 hover:text-gray-800 hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}

function CodeStep({ email, onBack, onVerified }: { email: string; onBack: () => void; onVerified: () => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const setDigit = (i: number, val: string) => {
    const clean = val.replace(/\D/g, '')
    if (!clean && val !== '') return
    const next = [...digits]
    next[i] = clean.slice(-1)
    setDigits(next)
    setError('')
    if (clean && i < 5) inputs.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = pasted.split('')
    while (next.length < 6) next.push('')
    setDigits(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const code = digits.join('')

  const verify = () => {
    if (code.length < 6) {
      setError('Enter the full 6-digit code.')
      return
    }
    onVerified()
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-5"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification Code</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Enter the code sent to <span className="font-medium text-gray-700">{email || 'your email'}</span>.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Verification Code</Label>
        <div className="flex gap-2 sm:gap-2.5">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              inputMode="numeric"
              maxLength={1}
              className="h-14 flex-1 min-w-0 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
            />
          ))}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <Button variant="primary" className="w-full h-11 mt-5" onClick={verify}>Verify</Button>

      <div className="text-center mt-6">
        <button className="text-xs font-medium text-orange-500 hover:text-orange-600 hover:underline">
          Send code again
        </button>
      </div>
    </div>
  )
}

function DoneStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Verified!</h2>
      <p className="text-gray-500 text-sm mb-6">Your identity has been verified. You can now reset your password and sign in.</p>
      <Button variant="primary" className="w-full h-11" onClick={onContinue}>Continue to Login</Button>
    </div>
  )
}
