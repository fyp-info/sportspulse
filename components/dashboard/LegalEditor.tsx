'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, ChevronDown, Save, Eye, RotateCcw,
  CheckCircle2, GripVertical, FileText, Shield,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import Toast from '@/components/dashboard/Toast'
import { legalDefault, type LegalContent as Content } from '@/lib/legal-defaults'

function uid(): string { return Math.random().toString(36).slice(2, 9) }

interface Props { type: 'privacy' | 'terms' }

export default function LegalEditor({ type }: Props) {
  const defaults = legalDefault(type)
  const [content, setContent] = useState<Content>(() => JSON.parse(JSON.stringify(defaults)))
  const [open, setOpen] = useState<Set<string>>(new Set([defaults.sections[0]?.id]))
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  const pageTitle = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'
  const previewHref = type === 'privacy' ? '/privacy' : '/terms'
  const Icon = type === 'privacy' ? Shield : FileText

  // Load the saved content (falls back to defaults server-side).
  useEffect(() => {
    let cancelled = false
    fetch(`/api/legal/${type}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.content?.sections) return
        setContent(d.content)
        setOpen(new Set([d.content.sections[0]?.id]))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [type])

  const toggleSection = (id: string) =>
    setOpen(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const setHero = (v: string) => setContent(p => ({ ...p, heroDescription: v }))
  const setCommitment = (v: string) => setContent(p => ({ ...p, commitment: v }))

  const updateSection = (id: string, field: 'title' | 'intro', v: string) =>
    setContent(p => ({ ...p, sections: p.sections.map(s => s.id === id ? { ...s, [field]: v } : s) }))

  const deleteSection = (id: string) =>
    setContent(p => ({ ...p, sections: p.sections.filter(s => s.id !== id) }))

  const addSection = () => {
    const id = uid()
    setContent(p => ({
      ...p,
      sections: [...p.sections, { id, title: 'New Section', intro: '', items: [{ id: uid(), label: '', text: '' }] }],
    }))
    setOpen(prev => new Set([...prev, id]))
  }

  const updateItem = (sid: string, iid: string, field: 'label' | 'text', v: string) =>
    setContent(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sid ? { ...s, items: s.items.map(i => i.id === iid ? { ...i, [field]: v } : i) } : s
      ),
    }))

  const addItem = (sid: string) =>
    setContent(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sid ? { ...s, items: [...s.items, { id: uid(), label: '', text: '' }] } : s
      ),
    }))

  const deleteItem = (sid: string, iid: string) =>
    setContent(p => ({
      ...p,
      sections: p.sections.map(s =>
        s.id === sid ? { ...s, items: s.items.filter(i => i.id !== iid) } : s
      ),
    }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/legal/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const json = await res.json()
      setToast(res.ok ? `${pageTitle} saved — the public page is updated.` : (json.error ?? 'Save failed'))
    } catch {
      setToast('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => { setContent(JSON.parse(JSON.stringify(defaults))); setToast('Content reset to defaults (not yet saved).') }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pageTitle} Editor</h1>
            <p className="text-sm text-gray-500">Edit the public {pageTitle} page content.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={previewHref} target="_blank">
              <Eye className="h-4 w-4" /> Preview
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Hero description */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Hero Description</p>
          <p className="text-xs text-gray-400 mt-0.5">Displayed below the page title in the dark banner at the top of the page.</p>
        </div>
        <Textarea
          value={content.heroDescription}
          onChange={e => setHero(e.target.value)}
          rows={2}
          className="resize-none text-sm"
          placeholder="Hero subtitle…"
        />
      </div>

      {/* Commitment / intro card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {type === 'privacy' ? '"We Care About Your Privacy" Card' : 'Introduction Card'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">The highlighted card shown near the top of the page before the main sections.</p>
        </div>
        <Textarea
          value={content.commitment}
          onChange={e => setCommitment(e.target.value)}
          rows={3}
          className="resize-none text-sm"
          placeholder="Introductory statement…"
        />
      </div>

      {/* Sections */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Sections <span className="text-gray-400 font-normal">({content.sections.length})</span></p>
        <div className="space-y-3">
          {content.sections.map((section, idx) => {
            const isOpen = open.has(section.id)
            return (
              <div key={section.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                {/* Section header row */}
                <div className="flex items-center gap-2 px-4 py-3.5">
                  <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex-1 flex items-center gap-3 text-left min-w-0"
                  >
                    <span className="text-xs font-bold text-orange-400 w-5 shrink-0">{idx + 1}</span>
                    <span className="text-sm font-semibold text-gray-800 truncate flex-1">
                      {section.title || 'Untitled section'}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{section.items.length} item{section.items.length !== 1 ? 's' : ''}</span>
                    <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform shrink-0', isOpen && 'rotate-180')} />
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    title="Delete section"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Section body */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4 bg-gray-50/30">
                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</label>
                      <Input
                        value={section.title}
                        onChange={e => updateSection(section.id, 'title', e.target.value)}
                        className="text-sm"
                        placeholder="Section title…"
                      />
                    </div>

                    {/* Intro */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Intro / Sub-heading{' '}
                        <span className="text-gray-400 font-normal normal-case">(optional — shown below section title)</span>
                      </label>
                      <Input
                        value={section.intro}
                        onChange={e => updateSection(section.id, 'intro', e.target.value)}
                        className="text-sm"
                        placeholder="Short intro sentence…"
                      />
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Content Items</label>
                      {section.items.map((item, iIdx) => (
                        <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-400">Item {iIdx + 1}</span>
                            <button
                              onClick={() => deleteItem(section.id, item.id)}
                              disabled={section.items.length <= 1}
                              className="p-1 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            value={item.label}
                            onChange={e => updateItem(section.id, item.id, 'label', e.target.value)}
                            placeholder="Bold label (leave blank for a plain paragraph)"
                            className="text-sm font-medium"
                          />
                          <Textarea
                            value={item.text}
                            onChange={e => updateItem(section.id, item.id, 'text', e.target.value)}
                            placeholder="Content text…"
                            rows={3}
                            className="resize-none text-sm"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => addItem(section.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-600 px-1 py-1 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add section */}
          <button
            onClick={addSection}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Section
          </button>
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Changes saved here update the content of the public{' '}
          <Link href={previewHref} target="_blank" className="font-semibold text-orange-500 hover:underline">
            /{type === 'privacy' ? 'privacy' : 'terms'}
          </Link>{' '}
          page immediately. Use the <strong>Preview</strong> button to see how it looks.
        </p>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
