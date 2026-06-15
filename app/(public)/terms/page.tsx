import { prisma } from '@/lib/prisma'
import { resolveLegalContent } from '@/lib/legal-defaults'
import LegalView from '@/components/legal/LegalView'

export const metadata = {
  title: 'Terms of Service · SportsPulse',
  description: 'The terms and conditions for using SportsPulse.',
}

export default async function TermsPage() {
  const doc = await prisma.legalDoc.findUnique({ where: { type: 'terms' } })
  const content = resolveLegalContent('terms', doc?.content)
  const updatedAt = (doc?.updatedAt ?? new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return <LegalView type="terms" content={content} updatedAt={updatedAt} />
}
