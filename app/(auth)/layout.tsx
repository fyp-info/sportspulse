import Link from 'next/link'
import { Zap, Trophy, Radio, BarChart3, Bell } from 'lucide-react'
import MaintenanceScreen from '@/components/layout/MaintenanceScreen'
import { getMaintenanceMode } from '@/lib/site-config'

const features = [
  { icon: Radio, title: 'Live scores', desc: 'Real-time updates as the action unfolds' },
  { icon: BarChart3, title: 'Standings & stats', desc: 'Deep tables across every league' },
  { icon: Trophy, title: 'Tournaments', desc: 'Follow brackets from group stage to final' },
  { icon: Bell, title: 'Match alerts', desc: 'Never miss a kickoff, lights-out or tip-off' },
]

const sports = [
  { src: '/ucl logo.png', label: 'Football' },
  { src: '/icc.png', label: 'Cricket' },
  { src: '/f1.png', label: 'Formula 1' },
]

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // The public login / register pages are part of the user-facing site, so they
  // go offline with it. Staff portals (/pulsekk…) are a separate route group
  // and stay accessible so the superadmin can turn maintenance back off.
  if (await getMaintenanceMode()) {
    return <MaintenanceScreen />
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: 'url(/Sport-banner.jpg)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(234,88,12,0.94) 0%, rgba(124,45,18,0.88) 45%, rgba(15,23,42,0.94) 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span>Sports<span className="text-white/80">Pulse</span></span>
          </Link>

          {/* Headline + features */}
          <div className="space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
                Your front-row seat to every game.
              </h1>
              <p className="text-white/75 text-lg leading-relaxed">
                Live scores, standings and stories across football, cricket and F1 — all in one place.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 backdrop-blur-sm ring-1 ring-white/15 shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] leading-tight">{f.title}</p>
                      <p className="text-white/65 text-sm">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sports strip */}
          <div className="flex items-center gap-5">
            {sports.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-white/70 text-xs font-medium">
                <div className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center p-1.5 shadow-sm">
                  <img src={s.src} alt={s.label} className="h-full w-full object-contain" />
                </div>
                <span className="hidden xl:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-[#f8faff]">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
        </Link>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
