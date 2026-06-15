import { NextResponse } from 'next/server'
import { authorize } from '@/lib/auth/api'
import { issueEmailVerificationCode } from '@/lib/auth/email-code'

// Logged-in member requests a fresh email-verification code.
export async function POST() {
  const { user, error } = await authorize('user')
  if (error) return error
  if (user.emailVerified) return NextResponse.json({ ok: true, alreadyVerified: true })

  await issueEmailVerificationCode(user.id, user.email)
  return NextResponse.json({ ok: true })
}
