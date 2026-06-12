import Link from 'next/link'
import { Zap, Share2, Globe, Rss, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your ultimate destination for football, cricket, Formula-1, and basketball news, scores, and analysis.
            </p>
            <div className="flex gap-3 mt-4">
              {[Share2, Globe, Rss, Mail].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Sports</h3>
            <ul className="space-y-2">
              {['Football', 'Cricket', 'Formula-1', 'Basketball'].map((sport) => (
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
                { href: '/about', label: 'About Us' },
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

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-500 mb-3">Get the latest sports news in your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button className="h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2026 SportsPulse. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
