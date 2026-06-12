import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import RoleSwitcher from '@/components/RoleSwitcher'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SportsPulse — Football, Cricket, F1 & Basketball',
  description: 'Your ultimate sports news destination covering Football, Cricket, Formula-1, and Basketball.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#f8faff] text-gray-900 antialiased">
        {children}
        <RoleSwitcher />
      </body>
    </html>
  )
}
