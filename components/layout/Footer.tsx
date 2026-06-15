import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your ultimate destination for football, cricket, and Formula-1 news, scores, and analysis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Sports</h3>
            <ul className="space-y-2">
              {['Football', 'Cricket', 'Formula-1'].map((sport) => (
                <li key={sport}>
                  <Link href={`/sports/${sport.toLowerCase()}`} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                    {sport}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/login', label: 'Sign In' },
                { href: '/register', label: 'Register' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2026 SportsPulse. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
