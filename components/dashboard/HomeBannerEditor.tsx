'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Eye, TrendingUp, Upload, ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Toast from '@/components/dashboard/Toast'

interface BannerForm {
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

interface Stats { blogs: number; readers: number; sports: number }

const DEFAULTS: BannerForm = {
  badge:        'Watch Stats and Score',
  headline:     'Your Pulse on the World of Sports',
  accentWord:   'Pulse',
  description:  'Football, Cricket, Formula-1 — breaking news, live scores, standings, and expert analysis all in one place.',
  primaryBtn:   'Latest News',
  primaryUrl:   '/blog',
  secondaryBtn: 'Explore Sports',
  secondaryUrl: '/sports/football',
  imageUrl:     '/Sport-banner.jpg',
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`
  return String(n)
}

function Field({ label, name, value, onChange, textarea }: {
  label: string; name: string; value: string
  onChange: (name: string, val: string) => void; textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      )}
    </div>
  )
}

export default function HomeBannerEditor() {
  const [form, setForm] = useState<BannerForm>(DEFAULTS)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/home-banner').then((r) => r.json()),
      fetch('/api/home-banner/stats').then((r) => r.json()).catch(() => null),
    ]).then(([bannerRes, statsRes]) => {
      if (bannerRes.banner) setForm({ ...DEFAULTS, ...bannerRes.banner })
      if (statsRes) setStats(statsRes)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const set = (name: string, val: string) => setForm((f) => ({ ...f, [name]: val }))

  const handleImageFile = async (file: File) => {
    setUploadError('')
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setUploadError('Only PNG, JPG, WebP, or GIF files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be 5 MB or smaller.')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'banner')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-auth-realm': 'staff' },
        body: fd,
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error ?? 'Upload failed')
      setForm((f) => ({ ...f, imageUrl: j.url }))
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleImageFile(file)
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/home-banner', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'Save failed')
      }
      setToast('Hero banner updated — changes are live on the home page.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const parts = form.headline.split(form.accentWord)

  if (loading) {
    return <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center text-sm text-gray-400">Loading…</div>
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Home Banner</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit the hero section shown on the public home page</p>
        </div>
        <Button variant="primary" onClick={save} disabled={saving || uploading}>
          <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Content</h2>
          <Field label="Badge Text" name="badge" value={form.badge} onChange={set} />
          <Field label="Main Headline" name="headline" value={form.headline} onChange={set} />
          <Field label="Accent Word (highlighted orange)" name="accentWord" value={form.accentWord} onChange={set} />
          <Field label="Description" name="description" value={form.description} onChange={set} textarea />

          {/* Background image upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Background Image</label>

            {/* Current image thumbnail */}
            {form.imageUrl && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 h-28 group">
                <img src={form.imageUrl} alt="Banner background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
                    className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Drop zone / upload button */}
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !uploading && fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-5 cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-colors"
            >
              {uploading ? (
                <>
                  <div className="h-6 w-6 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                  <p className="text-xs text-gray-500">Uploading…</p>
                </>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    {form.imageUrl ? <ImageIcon className="h-5 w-5 text-orange-400" /> : <Upload className="h-5 w-5 text-orange-400" />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-700">
                      {form.imageUrl ? 'Replace image' : 'Upload background image'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Click or drag & drop · PNG, JPG, WebP · max 5 MB</p>
                  </div>
                </>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide pt-2">Buttons</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary Button Text" name="primaryBtn" value={form.primaryBtn} onChange={set} />
            <Field label="Primary Button URL" name="primaryUrl" value={form.primaryUrl} onChange={set} />
            <Field label="Secondary Button Text" name="secondaryBtn" value={form.secondaryBtn} onChange={set} />
            <Field label="Secondary Button URL" name="secondaryUrl" value={form.secondaryUrl} onChange={set} />
          </div>
        </div>

        {/* Preview + Stats */}
        <div className="space-y-4">
          {/* Live preview */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Preview</h2>
            </div>
            <div
              className="relative rounded-2xl overflow-hidden p-6 min-h-40 bg-gray-800"
              style={form.imageUrl ? { backgroundImage: `url(${form.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              <div className="absolute inset-0 bg-black/55 rounded-2xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full mb-3">
                  <TrendingUp className="h-3 w-3" /> {form.badge}
                </span>
                <h1 className="text-2xl font-extrabold text-white leading-tight mb-2">
                  {parts[0]}<span className="text-orange-400">{form.accentWord}</span>{parts[1]}
                </h1>
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">{form.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg">{form.primaryBtn}</span>
                  <span className="text-xs border border-white/30 text-white px-3 py-1.5 rounded-lg">{form.secondaryBtn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live stats */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Live Stats (auto-counted from DB)</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Blogs',   value: stats ? fmt(stats.blogs)   : '—', desc: 'Published posts' },
                { label: 'Readers', value: stats ? fmt(stats.readers) : '—', desc: 'Registered users' },
                { label: 'Sports',  value: stats ? String(stats.sports) : '3', desc: 'Active sports' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-center">
                  <div className="text-xl font-bold text-orange-500">{s.value}</div>
                  <div className="text-xs font-semibold text-gray-700">{s.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">These numbers appear on the hero banner and update automatically as data changes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
