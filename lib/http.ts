// Small request helpers shared by route handlers.

export function getClientInfo(req: Request): { ip: string; device: string; userAgent: string } {
  const h = req.headers
  const ip =
    (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || '').trim() || 'unknown'
  const userAgent = h.get('user-agent') || ''
  return { ip, device: parseDevice(userAgent), userAgent }
}

function parseDevice(ua: string): string {
  if (!ua) return 'Unknown'
  const browser =
    /edg/i.test(ua) ? 'Edge'
    : /chrome|crios/i.test(ua) ? 'Chrome'
    : /firefox|fxios/i.test(ua) ? 'Firefox'
    : /safari/i.test(ua) ? 'Safari'
    : 'Browser'
  const os =
    /windows/i.test(ua) ? 'Windows'
    : /iphone|ipad|ios/i.test(ua) ? 'iOS'
    : /mac os/i.test(ua) ? 'macOS'
    : /android/i.test(ua) ? 'Android'
    : /linux/i.test(ua) ? 'Linux'
    : 'Unknown OS'
  return `${browser} / ${os}`
}

// Shape a DB user into the public object the client store expects.
export function publicUser(u: {
  id: string
  username: string
  name?: string
  email: string
  role: string
  avatar: string
  bio: string
  emailVerified?: boolean
  twoFactorEnabled?: boolean
}) {
  return {
    id: u.id,
    username: u.username,
    name: u.name ?? '',
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    bio: u.bio,
    emailVerified: u.emailVerified ?? false,
    twoFactorEnabled: u.twoFactorEnabled ?? false,
  }
}
