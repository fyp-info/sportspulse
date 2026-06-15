'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface BannerData {
  badge: string
  headline: string
  accentWord: string
  description: string
  primaryBtn: string
  primaryUrl: string
  secondaryBtn: string
  secondaryUrl: string
  imageUrl: string
}

export interface BannerStats {
  blogs: number
  readers: number
  sports: number
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`
  return String(n)
}

export default function HeroBannerClient({ banner, stats }: { banner: BannerData; stats: BannerStats }) {
  const statItems = [
    { stat: fmt(stats.blogs),   label: 'Blogs' },
    { stat: fmt(stats.readers), label: 'Readers' },
    { stat: String(stats.sports), label: 'Sports' },
  ]

  // Split headline around accentWord for orange highlight
  const parts = banner.headline.split(banner.accentWord)

  return (
    <section
      className="relative overflow-hidden rounded-3xl p-8 md:p-16"
      style={{ backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/55 rounded-3xl" />
      <div className="absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="relative max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2 mb-5">
          <Badge variant="default" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" /> {banner.badge}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5"
          style={{ letterSpacing: '-0.02em' }}
        >
          {parts[0]}<span className="text-orange-400">{banner.accentWord}</span>{parts[1]}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-gray-200 text-lg mb-7 leading-relaxed">
          {banner.description}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href={banner.primaryUrl}>{banner.primaryBtn} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white">
            <Link href={banner.secondaryUrl}>{banner.secondaryBtn}</Link>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-8 mt-10 pt-7 border-t border-white/20">
          {statItems.map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-bold text-orange-400">{item.stat}</div>
              <div className="text-xs text-gray-300 mt-0.5">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
