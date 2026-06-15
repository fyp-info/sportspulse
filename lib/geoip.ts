// IP geolocation lookup. Resolves an IP to its real public address and
// country / city / network (ISP) using ip-api.com — a free, keyless service
// (45 req/min on the free tier).
//
// Important: in local development (and behind some proxies) the captured
// request IP is a loopback/private address like 127.0.0.1, which has no real
// location. In that case we query ip-api.com WITHOUT an address, which returns
// the geolocation of this machine's own public IP — i.e. the real-time country,
// city and network the server is actually connecting from.
//
// Results are cached in-memory (1h) so repeated attempts from the same address
// (e.g. a brute-force burst) don't repeatedly hit the API.

export interface GeoInfo {
  ip: string // the resolved PUBLIC ip (may differ from the captured one when local)
  country: string
  city: string
  network: string
}

const cache = new Map<string, { at: number; geo: GeoInfo }>()
const TTL = 1000 * 60 * 60 // 1 hour

function isPrivateOrLocal(ip: string): boolean {
  if (!ip || ip === 'unknown') return true
  if (ip === '::1' || ip.startsWith('127.') || ip.startsWith('::ffff:127.')) return true
  // RFC1918 private ranges + link-local.
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true
  if (ip.startsWith('169.254.')) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true
  // IPv6 unique-local / link-local.
  if (/^f[cd]/i.test(ip) || /^fe80:/i.test(ip)) return true
  return false
}

/**
 * Best-effort geolocation. Never throws. For private/local input it resolves
 * the machine's own public IP instead. Returns the captured ip with blank
 * location only if the lookup fails entirely.
 */
export async function geolocateIp(ip: string): Promise<GeoInfo> {
  const key = ip || 'unknown'
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL) return hit.geo

  const local = isPrivateOrLocal(ip)
  // No address → ip-api geolocates the caller's (this server's) public IP.
  const endpoint = local
    ? 'http://ip-api.com/json/?fields=status,country,city,isp,query'
    : `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city,isp,query`

  let geo: GeoInfo = { ip: ip === 'unknown' ? '' : ip, country: '', city: '', network: '' }
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(endpoint, { signal: controller.signal, cache: 'no-store' })
    clearTimeout(timer)
    if (res.ok) {
      const data = await res.json()
      if (data.status === 'success') {
        geo = {
          ip: data.query || (ip === 'unknown' ? '' : ip),
          country: data.country || '',
          city: data.city || '',
          network: data.isp || '',
        }
      }
    }
  } catch {
    // network error / timeout → keep the blank fallback
  }

  cache.set(key, { at: Date.now(), geo })
  return geo
}
