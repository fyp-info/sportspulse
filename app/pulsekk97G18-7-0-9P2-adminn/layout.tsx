import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, #e8f0ff 0%, #f5f9ff 50%, #ffffff 100%)' }}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
