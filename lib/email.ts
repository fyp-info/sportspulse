import 'server-only'
import nodemailer from 'nodemailer'

const APP_URL = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    console.warn('[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — emails will be logged, not sent.')
    return null
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
  return transporter
}

/** Best-effort send. Never throws — failures are logged so auth flows still succeed. */
async function send(to: string, subject: string, html: string): Promise<void> {
  const t = getTransporter()
  if (!t) {
    console.info(`[email:dev] To ${to} — ${subject}\n${html}`)
    return
  }
  try {
    await t.sendMail({
      from: `"SportsPulse" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error('[email] send failed:', err)
  }
}

function shell(title: string, body: string, cta?: { href: string; label: string }): string {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:10px;background:#f97316;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700">⚡</div>
      <span style="font-size:20px;font-weight:700;color:#111">Sports<span style="color:#f97316">Pulse</span></span>
    </div>
    <h1 style="font-size:20px;color:#111;margin:0 0 8px">${title}</h1>
    <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 20px">${body}</p>
    ${cta ? `<a href="${cta.href}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600;font-size:14px">${cta.label}</a>
    <p style="color:#999;font-size:12px;margin-top:20px;word-break:break-all">Or paste this link: ${cta.href}</p>` : ''}
  </div>`
}

export async function sendVerificationCodeEmail(to: string, code: string): Promise<void> {
  await send(
    to,
    `Your SportsPulse verification code: ${code}`,
    shell(
      'Confirm your email',
      `Welcome to SportsPulse! Enter this 6-digit code to verify your email address. It expires in 24 hours.<br/><br/>
       <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111">${code}</span>`,
    ),
  )
}

export async function sendLoginCodeEmail(to: string, code: string): Promise<void> {
  await send(
    to,
    `Your SportsPulse login code: ${code}`,
    shell(
      'Your login verification code',
      `Use this 6-digit code to finish signing in. It expires in 10 minutes.<br/><br/>
       <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111">${code}</span><br/><br/>
       If you didn't try to sign in, change your password immediately.`,
    ),
  )
}

const STAFF_LOGIN_URL = `${APP_URL}/pulsekk97G18-7-0-9P2-adminn/login`

export async function sendStaffWelcomeEmail(
  to: string,
  info: { name: string; username: string; role: string; password: string },
): Promise<void> {
  await send(
    to,
    'Your SportsPulse staff account',
    shell(
      `Welcome${info.name ? ', ' + info.name : ''}!`,
      `A <strong>${info.role}</strong> account has been created for you on SportsPulse. Use these credentials to sign in:<br/><br/>
       <table style="font-size:14px;color:#333">
         <tr><td style="padding:2px 12px 2px 0;color:#888">Name</td><td><strong>${info.name || '—'}</strong></td></tr>
         <tr><td style="padding:2px 12px 2px 0;color:#888">Username</td><td><strong>${info.username}</strong></td></tr>
         <tr><td style="padding:2px 12px 2px 0;color:#888">Email</td><td><strong>${to}</strong></td></tr>
         <tr><td style="padding:2px 12px 2px 0;color:#888">Password</td><td><strong>${info.password}</strong></td></tr>
       </table><br/>
       For your security, please change your password after your first sign-in.`,
      { href: STAFF_LOGIN_URL, label: 'Go to Staff Login' },
    ),
  )
}

export async function sendPasswordChangedEmail(to: string, newPassword: string): Promise<void> {
  await send(
    to,
    'Your SportsPulse password was reset',
    shell(
      'Your password was reset',
      `An administrator reset your password. Your new password is:<br/><br/>
       <span style="font-size:22px;font-weight:700;letter-spacing:1px;color:#111">${newPassword}</span><br/><br/>
       Please sign in and change it as soon as possible.`,
      { href: STAFF_LOGIN_URL, label: 'Go to Staff Login' },
    ),
  )
}

export async function sendContactReplyEmail(
  to: string,
  info: { name: string; subject: string; originalMessage: string; replyText: string },
): Promise<void> {
  await send(
    to,
    `Re: ${info.subject} — SportsPulse`,
    shell(
      `Re: ${info.subject}`,
      `Hi ${info.name},<br/><br/>
       Thank you for reaching out to SportsPulse. Here is our reply to your message:<br/><br/>
       <div style="background:#f9fafb;border-left:3px solid #f97316;padding:12px 16px;border-radius:0 8px 8px 0;margin:8px 0 16px">
         <p style="color:#555;font-size:13px;margin:0">${info.replyText.replace(/\n/g, '<br/>')}</p>
       </div>
       <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
       <p style="color:#aaa;font-size:12px;margin:0">Your original message:</p>
       <p style="color:#aaa;font-size:12px;margin:4px 0 0">${info.originalMessage.replace(/\n/g, '<br/>')}</p>`,
    ),
  )
}

export async function sendPasswordResetCodeEmail(to: string, code: string): Promise<void> {
  await send(
    to,
    `Your SportsPulse password reset code: ${code}`,
    shell(
      'Reset your password',
      `Use this 6-digit code to reset your password. It expires in 15 minutes.<br/><br/>
       <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#111">${code}</span><br/><br/>
       If you didn't request a password reset, you can ignore this email.`,
    ),
  )
}
