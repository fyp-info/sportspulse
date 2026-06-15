import { Wrench, Zap } from 'lucide-react'

// Full-screen card shown to public visitors while the site is in maintenance.
export default function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-8 sm:p-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Sports<span className="text-orange-500">Pulse</span></span>
        </div>

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <Wrench className="h-10 w-10 text-orange-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">We&apos;ll be right back</h1>
        <p className="text-gray-500 leading-relaxed">
          SportsPulse is currently down for scheduled maintenance. We&apos;re working to improve your
          experience and will be back online shortly. Thank you for your patience.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 px-4 py-2 text-sm font-medium text-orange-600">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Maintenance in progress
        </div>
      </div>
    </div>
  )
}
