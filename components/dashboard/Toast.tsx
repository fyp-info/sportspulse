'use client'

import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 max-w-sm rounded-2xl border border-green-100 bg-white shadow-xl px-4 py-3.5 animate-in fade-in slide-in-from-bottom-2">
      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
      <p className="text-sm text-gray-700 flex-1 leading-relaxed">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
