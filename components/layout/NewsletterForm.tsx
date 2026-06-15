'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-700">
        <Check className="h-4 w-4 shrink-0" /> You&apos;re subscribed — thanks!
      </div>
    )
  }

  return (
    <form onSubmit={subscribe} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
        placeholder="your@email.com"
        className="flex-1 h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="h-9 px-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
