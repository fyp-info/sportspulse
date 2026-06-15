import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-orange-100 text-orange-600 border border-orange-200',
        secondary: 'bg-blue-100 text-blue-600 border border-blue-200',
        success: 'bg-green-100 text-green-600 border border-green-200',
        destructive: 'bg-red-100 text-red-600 border border-red-200',
        warning: 'bg-yellow-100 text-yellow-600 border border-yellow-200',
        outline: 'border border-gray-200 text-gray-600 bg-white',
        football: 'bg-green-100 text-green-700 border border-green-200',
        'formula-1': 'bg-red-100 text-red-700 border border-red-200',
        cricket: 'bg-blue-100 text-blue-700 border border-blue-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
