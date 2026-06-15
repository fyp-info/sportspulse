'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, X, Tag, Image as ImageIcon, Check, FileText, Eye, Upload, Edit, Trash2, List, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import ArticleCard from '@/components/blog/ArticleCard'
import { useStaffAuth } from '@/lib/store/auth-store'
import { canManageRole, type Role } from '@/lib/auth/roles'
import type { Post, Sport } from '@/lib/mock-data/posts'

const sports: Sport[] = ['Football', 'Cricket', 'Formula-1']

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

const today = () => new Date().toISOString().slice(0, 10)

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  scheduled: 'bg-blue-100 text-blue-700',
}

const ROLE_COLORS: Record<string, string> = {
  editor: 'bg-blue-50 text-blue-600',
  moderator: 'bg-purple-50 text-purple-600',
  admin: 'bg-orange-50 text-orange-600',
  superadmin: 'bg-red-50 text-red-600',
}

export default function BlogEditor() {
  const { user } = useStaffAuth()

  // ── Form state ─────────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [sport, setSport] = useState<Sport>('Football')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState<Post | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // ── Edit / All Posts state ─────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Load every blog (all authors / all roles) on mount — visible to all staff.
  useEffect(() => {
    fetch('/api/posts?status=all', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAllPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoadingPosts(false))
  }, [])

  // Seniority rule: manage your own post, or one whose author is a strictly
  // junior role (superadmin → anyone, admin → moderator/editor, moderator →
  // editor, editor → self only). Peers can't manage each other's posts.
  const canManage = (p: Post) => {
    if (!user) return false
    if (p.author === user.username) return true
    return canManageRole(user.role as Role, (p.authorRole ?? 'user') as Role)
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fillForm = (p: Post) => {
    setTitle(p.title)
    setExcerpt(p.excerpt)
    setContent(p.content)
    setSport(p.sport as Sport)
    setCategory(p.category)
    setImage(p.image ?? '')
    setTags(p.tags ?? [])
    setFeatured(p.featured)
  }

  const clearForm = () => {
    setTitle(''); setExcerpt(''); setContent(''); setSport('Football'); setCategory('')
    setImage(''); setTags([]); setTagInput(''); setFeatured(false)
    if (imageInputRef.current) imageInputRef.current.value = ''
    setError('')
  }

  const reset = () => {
    clearForm()
    setPublished(null)
    setEditingId(null)
  }

  const startEdit = (p: Post) => {
    setPublished(null)
    setEditingId(p.id)
    fillForm(p)
    setError('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    clearForm()
  }

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'blog')
      const res = await fetch('/api/upload', { method: 'POST', body: form, headers: { 'x-auth-realm': 'staff' } })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Image upload failed') }
      else { setImage(json.url) }
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // ── Tags ───────────────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  const onTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    else if (e.key === 'Backspace' && !tagInput && tags.length) setTags((prev) => prev.slice(0, -1))
  }

  // ── Submit (create or update) ──────────────────────────────────────────────
  const submit = async () => {
    if (!title.trim() || !excerpt.trim() || !content.trim() || !category.trim()) {
      setError('Title, excerpt, category and content are required.')
      return
    }
    setError('')
    setSubmitting(true)
    const payload = { title, excerpt, content, sport, category, image, tags, featured, status: 'published' }

    try {
      if (editingId) {
        const res = await fetch(`/api/posts/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.error ?? 'Failed to update blog'); return }
        setAllPosts((prev) => prev.map((p) => (p.id === editingId ? json.post : p)))
        setEditingId(null)
        clearForm()
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3500)
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.error ?? 'Failed to publish blog'); return }
        setPublished(json.post)
        setAllPosts((prev) => [json.post, ...prev])
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deletePost = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAllPosts((prev) => prev.filter((p) => p.id !== id))
        if (editingId === id) { setEditingId(null); clearForm() }
      }
    } finally {
      setDeletingId(null)
    }
  }

  // ── Live preview ───────────────────────────────────────────────────────────
  const preview: Post = {
    id: editingId ?? 'preview',
    slug: slugify(title) || 'your-blog-slug',
    title: title || 'Your blog title goes here',
    excerpt: excerpt || 'A short excerpt that summarises your blog will appear here.',
    content,
    sport,
    category: category || 'General',
    author: user?.username ?? 'you',
    authorName: user?.name?.trim() || user?.username || 'you',
    authorEmail: user?.email ?? '',
    publishedAt: today(),
    image,
    views: 0,
    likes: 0,
    shares: 0,
    status: 'published',
    featured,
    tags,
  }

  // ── Success screen (after create) ──────────────────────────────────────────
  if (published) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Blog Published!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your blog is live at <span className="font-mono text-gray-700">/blog/{published.slug}</span>
          </p>
          <div className="text-left mb-6">
            <ArticleCard post={published} />
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={reset}>Write Another</Button>
            <Button variant="primary" asChild><Link href={`/blog/${published.slug}`}>View Blog</Link></Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10" ref={formRef}>
      {/* ── Update success banner ── */}
      {updateSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <Check className="h-4 w-4 shrink-0" />
          Blog updated successfully.
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {editingId ? 'Edit Blog' : 'Create Blog'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {editingId ? 'Update your blog details below' : 'Write a new blog for the SportsPulse blog'}
          </p>
        </div>
        {editingId && (
          <Button variant="outline" size="sm" onClick={cancelEdit}>
            <X className="h-4 w-4" /> Cancel Edit
          </Button>
        )}
      </div>

      {/* ── Form + preview ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Blog Details</h3>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. UCL Final Preview: Real Madrid vs Bayern" value={title} onChange={(e) => setTitle(e.target.value)} />
              {title && <p className="text-xs text-gray-400">Slug: <span className="font-mono">/blog/{slugify(title)}</span></p>}
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea rows={2} placeholder="A short summary shown on blog cards…" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Sport Category</Label>
              <div className="flex flex-wrap gap-1.5">
                {sports.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSport(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sport === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category / Competition</Label>
              <Input placeholder="e.g. Champions League, T20 World Cup, Test Series" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Cover Image <span className="text-gray-400 font-normal">(optional)</span></Label>
              {image ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={image} alt="Cover" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/60 text-white text-xs px-2.5 py-1.5 hover:bg-black/80 transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" /> Replace
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-400 disabled:opacity-60"
                >
                  <Upload className={`h-6 w-6 ${uploading ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Click to upload cover image'}</span>
                  <span className="text-xs">PNG, JPG, WebP, GIF · max 5 MB</span>
                </button>
              )}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                rows={8}
                placeholder="Write your blog here. Separate paragraphs with a blank line."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-gray-400">Tip: leave a blank line between paragraphs.</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tags</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 p-2 min-h-11">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-medium px-2 py-1 rounded-md">
                    {t}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="hover:text-orange-800">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKey}
                  placeholder={tags.length ? 'Add another…' : 'Type a tag and press Enter'}
                  className="flex-1 min-w-32 bg-transparent text-sm outline-none px-1 py-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Featured blog</p>
                <p className="text-xs text-gray-400">Highlight this post on the blog</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button variant="primary" className="w-full h-11" onClick={submit} disabled={submitting || uploading}>
              <Plus className="h-4 w-4" />
              {submitting
                ? (editingId ? 'Updating…' : 'Publishing…')
                : (editingId ? 'Update Blog' : 'Publish Blog')}
            </Button>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" /> Live Preview
            </div>
            <ArticleCard post={preview} />
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {featured && <Badge variant="default">Featured</Badge>}
                <span className="text-xs text-gray-400">{preview.category}</span>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">All Blogs</h2>
          {!loadingPosts && <Badge variant="outline">{allPosts.length}</Badge>}
          <span className="text-xs text-gray-400">· every author across all roles</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {loadingPosts ? (
            <p className="text-sm text-gray-400 text-center py-10">Loading…</p>
          ) : allPosts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No blogs have been written yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Title', 'Sport', 'Category', 'Published By', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allPosts.map((p) => {
                    const mine = p.author === user?.username
                    const manageable = canManage(p)
                    return (
                    <tr
                      key={p.id}
                      className={`border-b border-gray-50 transition-colors ${editingId === p.id ? 'bg-orange-50/60' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-medium text-gray-800 truncate">{p.title}</div>
                        <div className="text-xs text-gray-400 font-mono truncate">/blog/{p.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.sport}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-gray-700">
                            {p.authorName || p.author}
                            {mine && <span className="ml-1.5 text-[10px] font-normal text-orange-500">(you)</span>}
                          </span>
                          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${ROLE_COLORS[p.authorRole ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                            {p.authorRole ?? 'user'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{p.publishedAt}</td>
                      <td className="px-4 py-3">
                        {manageable ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 ${editingId === p.id ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}
                              onClick={() => editingId === p.id ? cancelEdit() : startEdit(p)}
                              title={editingId === p.id ? 'Cancel edit' : 'Edit'}
                            >
                              {editingId === p.id ? <X className="h-3.5 w-3.5" /> : <Edit className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deletePost(p.id)}
                              disabled={deletingId === p.id}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-300" title="Only the author or a moderator+ can edit this">—</span>
                        )}
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
