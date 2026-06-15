'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Password reset now happens via a 6-digit code entered directly on the
// forgot-password page. Old link-based tokens are no longer issued, so any
// direct visit to /reset-password?token=... is invalid.
export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Link not valid</h2>
      <p className="text-gray-500 text-sm mb-6">
        Password resets now use a 6-digit code sent to your email — no link needed.
        Request a new code to continue.
      </p>
      <Button variant="primary" className="w-full" asChild>
        <Link href="/forgot-password">Request Reset Code</Link>
      </Button>
    </div>
  )
}
