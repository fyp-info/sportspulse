import { ClipboardList } from 'lucide-react'
import AuditLogTable from '@/components/dashboard/AuditLogTable'

export default function SuperAdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Full history of all admin and system actions</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
        <AuditLogTable />
      </div>
    </div>
  )
}
