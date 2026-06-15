import 'server-only'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationCodeEmail, sendLoginCodeEmail, sendPasswordResetCodeEmail } from '@/lib/email'

function sixDigit(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export const MAX_OTP_ATTEMPTS = 5

export type OtpResult = 'ok' | 'expired' | 'locked' | 'invalid'

/**
 * Constant-time verify a 6-digit code against a stored VerificationToken with
 * brute-force protection: after MAX_OTP_ATTEMPTS wrong tries the code is
 * consumed (deleted) so it can't be guessed further — the user must request a
 * fresh one. Returns the outcome so callers can respond appropriately.
 */
export async function verifyOtp(
  vt: { id: string; otp: string | null; attempts: number; expiresAt: Date },
  code: string,
): Promise<OtpResult> {
  if (!vt.otp || vt.expiresAt < new Date()) return 'expired'

  if (vt.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.verificationToken.delete({ where: { id: vt.id } }).catch(() => {})
    return 'locked'
  }

  const ok = await bcrypt.compare(code, vt.otp)
  if (!ok) {
    await prisma.verificationToken.update({
      where: { id: vt.id },
      data: { attempts: { increment: 1 } },
    })
    return 'invalid'
  }
  return 'ok'
}

/**
 * Issue a one-time 6-digit login/2FA code for a user. Stores it hashed under a
 * fresh `two_factor` token (10-min expiry) and emails it. Returns the
 * challenge id used to verify it.
 */
export async function issueLoginCode(userId: string, email: string): Promise<string> {
  await prisma.verificationToken.deleteMany({ where: { userId, type: 'two_factor' } })
  const code = sixDigit()
  const challengeId = crypto.randomUUID()
  await prisma.verificationToken.create({
    data: {
      token: challengeId,
      otp: await bcrypt.hash(code, 10),
      type: 'two_factor',
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
    },
  })
  await sendLoginCodeEmail(email, code)
  return challengeId
}

// Generate a fresh 6-digit email-verification code, store it (hashed), and email it.
export async function issueEmailVerificationCode(userId: string, email: string): Promise<void> {
  // Replace any pending verification codes for this user.
  await prisma.verificationToken.deleteMany({ where: { userId, type: 'email_verify' } })

  const code = String(Math.floor(100000 + Math.random() * 900000))
  await prisma.verificationToken.create({
    data: {
      token: crypto.randomUUID(), // unique row key
      otp: await bcrypt.hash(code, 10),
      type: 'email_verify',
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  })

  await sendVerificationCodeEmail(email, code)
}

/**
 * Issue a one-time 6-digit password-reset code. Stores it hashed under a fresh
 * `password_reset` token (15-min expiry) and emails it. Returns the challenge
 * id used to verify and consume it.
 */
export async function issuePasswordResetCode(userId: string, email: string): Promise<string> {
  await prisma.verificationToken.deleteMany({ where: { userId, type: 'password_reset' } })
  const code = sixDigit()
  const challengeId = crypto.randomUUID()
  await prisma.verificationToken.create({
    data: {
      token: challengeId,
      otp: await bcrypt.hash(code, 10),
      type: 'password_reset',
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min
    },
  })
  await sendPasswordResetCodeEmail(email, code)
  return challengeId
}
