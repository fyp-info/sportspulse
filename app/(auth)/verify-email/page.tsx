'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type State = 'pending' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [state, setState] = useState<State>('pending')

  useEffect(() => {
    const t = setTimeout(() => setState('success'), 2500)
    return () => clearTimeout(t)
  }, [])

  if (state === 'pending') {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
        <p className="text-gray-500 text-sm">This will only take a moment.</p>
      </div>
    )
  }

  if (state === 'success') {
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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
      <p className="text-gray-500 text-sm mb-6">The link is invalid or has expired.</p>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" asChild><Link href="/forgot-password">Resend Link</Link></Button>
        <Button variant="primary" className="flex-1" asChild><Link href="/login">Back to Login</Link></Button>
      </div>
    </div>
  )
}
