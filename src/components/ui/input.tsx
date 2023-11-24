import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva('block w-full rounded-md focus:outline-none sm:text-sm', {
  variants: {
    variant: {
      default: 'border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500',
      error: 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, variant, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, className }), className)} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };
