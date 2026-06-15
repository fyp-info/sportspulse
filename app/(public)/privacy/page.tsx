import { prisma } from '@/lib/prisma'
import { resolveLegalContent } from '@/lib/legal-defaults'
import LegalView from '@/components/legal/LegalView'

export const metadata = {
  title: 'Privacy Policy · SportsPulse',
  description: 'What data SportsPulse collects, how it is used, and how we protect it.',
}

export default async function PrivacyPolicyPage() {
  const doc = await prisma.legalDoc.findUnique({ where: { type: 'privacy' } })
  const content = resolveLegalContent('privacy', doc?.content)
  const updatedAt = (doc?.updatedAt ?? new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return <LegalView type="privacy" content={content} updatedAt={updatedAt} />
}
