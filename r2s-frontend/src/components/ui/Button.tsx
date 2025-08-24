'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-[#00C73C] text-white hover:bg-[#00A332]',
    secondary: 'bg-[#1AA34A] text-white hover:bg-[#158838]',
    outline: 'bg-transparent border-2 border-[#00C73C] text-[#00C73C] hover:bg-[#00C73C] hover:text-white',
    ghost: 'bg-transparent text-[#6C757D] hover:bg-[#F8F9FA]',
    danger: 'bg-[#DC3545] text-white hover:bg-[#C82333]'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[12px]',
    md: 'px-4 py-2 text-[14px]',
    lg: 'px-6 py-3 text-[16px]',
    xl: 'px-8 py-4 text-[18px]'
  };

  return (
    <button
      className={cn(
        'font-bold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        loading && 'relative',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  );
}