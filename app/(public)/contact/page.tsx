'use client'

import { useState } from 'react'
import { Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PERKS = [
  { icon: Zap,         title: 'Fast replies',     desc: 'Most messages answered within 24 hours.' },
  { icon: ShieldCheck, title: 'Real humans',      desc: 'No bots — our editorial team reads every note.' },
  { icon: MessageSquare, title: 'Tips welcome',   desc: 'Got a scoop? We love a good story lead.' },
]

export default function ContactPage() {
  const [sent, setSent]       = useState(false)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Could not send message')
        return
      }
      setSent(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 pt-20 pb-32 px-4">
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-orange-400/10 blur-2xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" /> Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Let's Talk <span className="text-orange-400">Sports</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
            Story tip, partnership idea, or just want to say hello? Send a message and we'll get right back to you.
          </p>
        </div>
      </div>

      {/* ── Floating split card ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-16 pb-20">
        <div className="grid md:grid-cols-5 rounded-3xl bg-white border border-gray-100 shadow-2xl shadow-gray-300/40 overflow-hidden">

          {/* Left: brand / perks panel */}
          <div className="md:col-span-2 relative overflow-hidden bg-linear-to-br from-orange-500 to-orange-600 p-8 flex flex-col">
            <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h2 className="text-xl font-extrabold text-white mb-2">Why reach out?</h2>
              <p className="text-orange-100 text-sm leading-relaxed mb-8">
                We're always listening to the community that makes SportsPulse what it is.
              </p>
              <div className="space-y-5">
                {PERKS.map((p) => {
                  const Icon = p.icon
                  return (
                    <div key={p.title} className="flex items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="h-4.5 w-4.5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{p.title}</p>
                        <p className="text-xs text-orange-100 mt-0.5 leading-snug">{p.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="relative mt-auto pt-8">
              <div className="flex items-center gap-2 text-orange-100 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" /> Avg. response time: under a day
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="px-8 py-16 text-center h-full flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage('') }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Smith"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more about your enquiry…"
                    rows={5}
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{error}</div>
                )}

                <Button type="submit" variant="primary" className="w-full h-11 text-sm font-bold rounded-xl" disabled={sending}>
                  <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send Message'}
                </Button>

                <p className="text-center text-xs text-gray-400">
                  By sending, you agree to be contacted about your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
