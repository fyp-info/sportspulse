'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, X, Eye, EyeOff } from 'lucide-react'
import { useUserAuth, useStaffAuth } from '@/lib/store/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Toast from '@/components/dashboard/Toast'

interface LoginRow {
  id: string
  date: string
  ip: string
  device: string
  location: string
  status: string
}

// Password field with a show/hide eye toggle.
// Convention: open eye = password visible, crossed eye = hidden.
function PasswordField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title={show ? 'Hide password' : 'Show password'}
        >
          {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

export default function ProfileTabContent({ realm = 'user' }: { realm?: 'user' | 'staff' }) {
  // Use the session that matches this context (public profile vs dashboard).
  const userStore = useUserAuth()
  const staffStore = useStaffAuth()
  const { user, setUser } = realm === 'staff' ? staffStore : userStore

  // Tell shared endpoints which session to act on.
  const realmHeader: Record<string, string> = realm === 'staff' ? { 'x-auth-realm': 'staff' } : {}

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loginHistory, setLoginHistory] = useState<LoginRow[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setHistoryLoading(true)
    fetch('/api/profile/login-history', { cache: 'no-store', headers: realmHeader })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setLoginHistory(d.history ?? []) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setHistoryLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realm])

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null)
  const [username, setUsername] = useState(user?.username ?? '')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')

  // Sync form fields once the session hydrates.
  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setName(user.name ?? '')
      setEmail(user.email)
      setBio(user.bio)
      setAvatarUrl(user.avatar || null)
    }
  }, [user])
  const [uploading, setUploading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // Upload to Cloudinary, then persist the URL on the user immediately.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'avatars')
      const up = await fetch('/api/upload', { method: 'POST', body: form, headers: realmHeader })
      const upJson = await up.json()
      if (!up.ok) { setError(upJson.error ?? 'Upload failed'); return }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...realmHeader },
        body: JSON.stringify({ avatar: upJson.url }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not save avatar'); return }
      setAvatarUrl(upJson.url)
      setUser(json.user)
      setToast('Profile photo updated.')
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = async () => {
    setError('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...realmHeader },
        body: JSON.stringify({ avatar: '' }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not remove avatar'); return }
      setAvatarUrl(null)
      setUser(json.user)
      setToast('Profile photo removed.')
    } catch {
      setError('Something went wrong.')
    }
  }

  const saveProfile = async () => {
    setError('')
    setSavingProfile(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...realmHeader },
        body: JSON.stringify({ username, name, email, bio }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not save profile'); return }
      setUser(json.user)
      setToast('Profile saved successfully.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async () => {
    setError('')
    if (newPw !== confirmPw) { setError('New passwords do not match.'); return }
    setSavingPw(true)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...realmHeader },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Could not update password'); return }
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setToast('Password updated successfully.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="space-y-6 mt-5">
      {/* Avatar */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex items-center gap-5">
        <div className="relative group shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-20 w-20 rounded-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-70"
            title="Change avatar"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-orange-100 text-orange-600 text-2xl font-bold flex items-center justify-center">
                {user?.username?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </button>
          {avatarUrl && (
            <button
              onClick={removeAvatar}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
              title="Remove avatar"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-gray-900">{user?.name?.trim() || user?.username}</div>
          <div className="text-gray-500 text-sm">{user?.email}</div>
          <Badge variant="default" className="capitalize mt-1.5">{user?.role}</Badge>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Camera className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Upload Photo'}
          </Button>
          {avatarUrl && (
            <Button variant="ghost" size="sm" onClick={removeAvatar} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <X className="h-4 w-4" /> Remove
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      {/* Profile info */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Profile Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Johnson" /></div>
          <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label>Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
        <Button variant="primary" onClick={saveProfile} disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Change Password</h3>
        <div className="space-y-3">
          <PasswordField label="Current Password" value={currentPw} onChange={setCurrentPw} />
          <PasswordField label="New Password" value={newPw} onChange={setNewPw} />
          <PasswordField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} />
        </div>
        <Button variant="primary" onClick={savePassword} disabled={savingPw || !currentPw || !newPw}>
          {savingPw ? 'Updating…' : 'Update Password'}
        </Button>
      </div>

      {/* Login history */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Login History</h3>
          {!historyLoading && <span className="text-xs text-gray-400">{loginHistory.length} recent session{loginHistory.length !== 1 ? 's' : ''}</span>}
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Date', 'IP', 'Device', 'Location', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
              ) : loginHistory.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No login history yet.</td></tr>
              ) : (
                loginHistory.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{row.ip}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs whitespace-nowrap">{row.device}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{row.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.status === 'success' ? 'success' : 'destructive'} className="text-[10px] capitalize">{row.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
