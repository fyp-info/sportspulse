'use client'

import { useState } from 'react'
import { Shield, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const backupCodes = [
  'XKCD-4821', 'MNTE-7032', 'PQRS-1947', 'WVXY-8521',
  'ABCD-3698', 'EFGH-7415', 'IJKL-9630', 'MNOP-2587',
]

export default function TwoFAPage() {
  const [enabled, setEnabled] = useState(false)
  const [showCodes, setShowCodes] = useState(false)
  const [copied, setCopied] = useState(false)
  const [code, setCode] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const copyAll = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Shield className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h1>
          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6">
        <div>
          <p className="font-medium text-gray-900">Enable 2FA</p>
          <p className="text-xs text-gray-500">{enabled ? 'Two-factor authentication is active' : 'Currently disabled'}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && !confirmed && (
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block">Scan QR Code</Label>
            <div className="flex items-center justify-center h-40 w-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 text-center mx-auto text-xs p-4">
              [QR Code Placeholder]<br />Scan with<br />Authenticator App
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">Or enter manually: <code className="text-orange-500 font-mono">JBSWY3DPEHPK3PXP</code></p>
          </div>

          <div className="space-y-2">
            <Label>Verification Code</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="font-mono text-center text-lg tracking-widest"
                maxLength={6}
              />
              <Button variant="primary" onClick={() => setConfirmed(true)} disabled={code.length !== 6}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {enabled && confirmed && (
        <div className="space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700">2FA is enabled</p>
              <p className="text-xs text-gray-500">Your account is now protected with two-factor authentication.</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Backup Codes</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowCodes(!showCodes)}>
                  {showCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showCodes ? 'Hide' : 'Show'}
                </Button>
                <Button variant="outline" size="sm" onClick={copyAll}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy All'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 border border-gray-100 p-4">
              {backupCodes.map((c) => (
                <code key={c} className={`text-sm font-mono text-center py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 transition-all ${showCodes ? '' : 'blur-sm select-none'}`}>
                  {c}
                </code>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">Save these codes somewhere safe. Each code can only be used once.</p>
          </div>
        </div>
      )}
    </div>
  )
}
