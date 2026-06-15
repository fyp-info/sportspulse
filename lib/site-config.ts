import 'server-only'
import { prisma } from '@/lib/prisma'

// Reads the single SiteConfig row, creating it on first access. Fails open:
// any error returns maintenance OFF so the site is never accidentally bricked.
export async function getMaintenanceMode(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (prisma as any).siteConfig
    if (!model) return false
    const row = await model.findFirst()
    return !!row?.maintenanceMode
  } catch {
    return false
  }
}

export async function setMaintenanceMode(on: boolean, updatedBy: string): Promise<void> {
  const existing = await prisma.siteConfig.findFirst()
  if (existing) {
    await prisma.siteConfig.update({ where: { id: existing.id }, data: { maintenanceMode: on, updatedBy } })
  } else {
    await prisma.siteConfig.create({ data: { maintenanceMode: on, updatedBy } })
  }
}
