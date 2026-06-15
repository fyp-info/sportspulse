'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Reply, Send, Inbox, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ContactMessage } from '@/lib/mock-data/contact'

type TabKey = 'all' | 'unread' | 'replies'

const patch = (id: string, body: Record<string, boolean>) =>
  fetch(`/api/contact/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})

export default function ContactInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [replyError, setReplyError] = useState('')
  const [sentId, setSentId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/contact', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setMessages(d.messages ?? []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const markRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
    patch(id, { read: true })
  }

  const remove = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    if (replyingId === id) setReplyingId(null)
    fetch(`/api/contact/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const openReply = (id: string) => {
    markRead(id)
    setReplyingId(id)
    setReplyText('')
    setReplyError('')
    setSentId(null)
  }

  const sendReply = async (id: string, email: string) => {
    if (!replyText.trim()) { setReplyError('Reply cannot be empty.'); return }
    setReplyError('')
    setSending(true)
    try {
      const res = await fetch(`/api/contact/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: replyText.trim() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setReplyError(json.error ?? 'Failed to send reply. Please try again.')
        return
      }
      // Update local state with the stored reply.
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, replied: true, read: true, replyText: replyText.trim() } : m,
        ),
      )
      setSentId(id)
      setReplyingId(null)
      setReplyText('')
    } catch {
      setReplyError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length
  const repliesCount = messages.filter((m) => m.replied).length

  const lists: Record<TabKey, ContactMessage[]> = {
    all: messages,
    unread: messages.filter((m) => !m.read),
    replies: messages.filter((m) => m.replied),
  }

  const renderList = (items: ContactMessage[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-sm text-gray-400">
          <Inbox className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          No messages here.
        </div>
      )
    }
    return (
      <div className="space-y-3">
        {items.map((m) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-5 transition-colors ${
              m.read ? 'border-gray-100 bg-white' : 'border-orange-100 bg-orange-50/40'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 text-sm font-bold flex items-center justify-center shrink-0">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {!m.read && <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />}
                  <span className="text-sm font-semibold text-gray-900">{m.name}</span>
                  <span className="text-xs text-gray-400">&lt;{m.email}&gt;</span>
                  {m.replied && (
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 rounded-md px-1.5 py-0.5">
                      Replied
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{m.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 mt-1.5">{m.subject}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{m.message}</p>

                {/* Sent reply confirmation */}
                {sentId === m.id && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-3 py-2.5 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    Reply sent to {m.email}
                  </div>
                )}

                {/* Previously sent reply preview */}
                {m.replied && m.replyText && sentId !== m.id && (
                  <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Your reply</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{m.replyText}</p>
                  </div>
                )}

                {/* Reply composer */}
                {replyingId === m.id && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-gray-400 mb-1">
                      Replying to <span className="text-gray-600 font-medium">{m.email}</span>
                    </div>
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => { setReplyText(e.target.value); setReplyError('') }}
                      placeholder={`Reply to ${m.name}…`}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                    />
                    {replyError && (
                      <div className="flex items-center gap-2 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {replyError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-8 text-xs"
                        onClick={() => sendReply(m.id, m.email)}
                        disabled={sending || !replyText.trim()}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        {sending ? 'Sending…' : 'Send Reply'}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setReplyingId(null); setReplyError('') }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {replyingId !== m.id && (
                  <div className="flex items-center gap-2 mt-3">
                    {!m.read && (
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-500 hover:text-gray-800" onClick={() => markRead(m.id)}>
                        <Mail className="h-3.5 w-3.5 mr-1" /> Mark read
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => openReply(m.id)}>
                      <Reply className="h-3.5 w-3.5 mr-1" /> {m.replied ? 'Reply again' : 'Reply'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => remove(m.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Inbox</h1>
        <p className="text-gray-500 text-sm mt-1">Messages submitted through the contact page</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="replies">Replies ({repliesCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-5">{renderList(lists.all)}</TabsContent>
        <TabsContent value="unread" className="mt-5">{renderList(lists.unread)}</TabsContent>
        <TabsContent value="replies" className="mt-5">{renderList(lists.replies)}</TabsContent>
      </Tabs>
    </div>
  )
}
