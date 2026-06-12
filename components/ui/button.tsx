'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
        outline: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-300 shadow-sm',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
        link: 'text-orange-500 underline-offset-4 hover:underline',
        primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm',
      },
      size: {
        default: 'h-9 px-5 py-2',
        sm: 'h-8 rounded-full px-4 text-xs',
        lg: 'h-11 rounded-full px-8',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
