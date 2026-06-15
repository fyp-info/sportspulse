import { NextResponse } from 'next/server'
import { authorize } from '@/lib/auth/api'
import { issueLoginCode } from '@/lib/auth/email-code'

// Begin enabling 2FA: email the signed-in user a confirmation code.
export async function POST() {
  const { user, error } = await authorize('user')
  if (error) return error

  await issueLoginCode(user.id, user.email)
  return NextResponse.json({ ok: true })
}
