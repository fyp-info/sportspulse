import Link from 'next/link'
import { ShieldCheck, FileText, Lock, MessageSquare } from 'lucide-react'
import type { LegalContent, LegalType } from '@/lib/legal-defaults'

interface Props {
  type: LegalType
  content: LegalContent
  updatedAt?: string
}

export default function LegalView({ type, content, updatedAt }: Props) {
  const HeroIcon = type === 'privacy' ? ShieldCheck : FileText
  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'
  const commitmentTitle = type === 'privacy' ? 'We care about your privacy' : 'Before you begin'

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 pt-20 pb-28 px-4">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-500/15 border border-orange-400/20 mb-6">
            <HeroIcon className="h-8 w-8 text-orange-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">{title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">{content.heroDescription}</p>
          {updatedAt && <p className="text-gray-500 text-sm mt-6">Last updated: {updatedAt}</p>}
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 -mt-12 pb-20 space-y-6">
        {/* Commitment card */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/60 p-8">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
              <Lock className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 mb-1.5">{commitmentTitle}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{content.commitment}</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {content.sections.map((section, idx) => (
          <section key={section.id} className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-start gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-200 text-white font-extrabold">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight">{section.title}</h3>
                {section.intro && <p className="text-sm text-gray-500 mt-1 leading-snug">{section.intro}</p>}
              </div>
            </div>
            <ul className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <li key={item.id} className="px-6 py-4 flex items-start gap-3.5">
                  <div className="h-2 w-2 rounded-full bg-orange-400 mt-2 shrink-0" />
                  <div>
                    {item.label && <p className="text-sm font-bold text-gray-800 leading-tight mb-0.5">{item.label}</p>}
                    <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Contact CTA */}
        <div className="rounded-3xl bg-linear-to-br from-orange-500 to-orange-600 p-7 text-center">
          <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/15 mb-3">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-extrabold text-white mb-1">Questions?</h3>
          <p className="text-sm text-orange-100 mb-4 max-w-md mx-auto leading-relaxed">
            If you have any questions about this {type === 'privacy' ? 'policy' : 'agreement'}, our team is happy to help.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}
