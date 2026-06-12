'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone, Share2, Globe, Rss, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-lg">Have a tip, story idea, or partnership enquiry? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            {sent ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Smith" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} required />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'hello@sportspulse.com' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 000-1234' },
                { icon: MapPin, label: 'Office', value: '350 5th Avenue, New York, NY 10118' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[Share2, Globe, Rss].map((Icon, i) => (
                  <button key={i} className="p-2.5 rounded-lg bg-gray-100 text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
