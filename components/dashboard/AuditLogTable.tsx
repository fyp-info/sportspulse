import { Download } from 'lucide-react'
import { auditLogs } from '@/lib/mock-data/users'
import { Button } from '@/components/ui/button'

export default function AuditLogTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{auditLogs.length} recent actions</p>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['User', 'Action', 'Target', 'Date', 'IP'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-orange-500">{log.user}</td>
                <td className="px-4 py-3 text-gray-800">{log.action}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.target}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{log.date}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
