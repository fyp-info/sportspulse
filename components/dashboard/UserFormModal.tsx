'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Role } from '@/lib/mock-data/users'

export interface UserFormValues {
  fullName: string
  email: string
  username: string
  password: string
  role: Role
}

interface Props {
  title: string
  subtitle?: string
  roleOptions: Role[]
  submitLabel?: string
  initial?: Partial<UserFormValues>
  passwordOptional?: boolean
  onClose: () => void
  // Return an error message to keep the modal open and show it; return
  // null/undefined on success so the modal closes.
  onSubmit?: (values: UserFormValues) => void | string | null | Promise<void | string | null>
}

export default function UserFormModal({
  title,
  subtitle,
  roleOptions,
  submitLabel = 'Save',
  initial,
  passwordOptional = false,
  onClose,
  onSubmit,
}: Props) {
  const [role, setRole] = useState<Role>(initial?.role ?? roleOptions[0])
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<UserFormValues, 'role'>>({
    defaultValues: {
      fullName: initial?.fullName ?? '',
      email: initial?.email ?? '',
      username: initial?.username ?? '',
      password: '',
    },
  })

  const submit = async (data: Omit<UserFormValues, 'role'>) => {
    setSubmitError('')
    // Wait for the result. If the caller returns an error string, keep the
    // modal open and show it; otherwise close on success.
    const err = await onSubmit?.({ ...data, role })
    if (typeof err === 'string' && err) {
      setSubmitError(err)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-2xl p-7 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-1.5">{subtitle}</p>}
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="Enter full name"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              placeholder="Enter username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Min 3 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers and underscores only — no spaces' },
              })}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder={passwordOptional ? 'Leave blank to keep current' : 'Enter password'}
              {...register('password', passwordOptional ? {} : { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-600">{submitError}</div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-11" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" className="flex-1 h-11" disabled={isSubmitting}>{submitLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
