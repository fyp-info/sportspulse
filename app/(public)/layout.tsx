import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import VerifyEmailBanner from '@/components/auth/VerifyEmailBanner'
import MaintenanceScreen from '@/components/layout/MaintenanceScreen'
import { getMaintenanceMode } from '@/lib/site-config'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // When the superadmin enables maintenance, the public website is replaced by
  // a single card. Dashboards and the staff portals are unaffected (separate
  // route groups), so the superadmin can still turn it back off.
  const maintenance = await getMaintenanceMode()
  if (maintenance) {
    return <MaintenanceScreen />
  }

  return (
    <>
      <Navbar />
      <VerifyEmailBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
