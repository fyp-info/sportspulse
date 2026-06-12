'use client'

import { Shield, Bell, Palette, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-5">
        {[
          { icon: Bell, title: 'Notifications', desc: 'Manage notification preferences', href: '/dashboard/user' },
          { icon: Shield, title: 'Security & 2FA', desc: 'Password, two-factor authentication', href: '/2fa' },
          { icon: Globe, title: 'Language & Region', desc: 'Set your preferred language' },
          { icon: Palette, title: 'Appearance', desc: 'Theme and display settings' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              {item.href ? (
                <Button variant="outline" size="sm" asChild><Link href={item.href}>Manage</Link></Button>
              ) : (
                <Button variant="outline" size="sm">Configure</Button>
              )}
            </div>
          )
        })}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-semibold text-red-600 mb-1">Danger Zone</h3>
          <p className="text-sm text-gray-500 mb-4">Irreversible account actions.</p>
          <Button variant="destructive" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}
