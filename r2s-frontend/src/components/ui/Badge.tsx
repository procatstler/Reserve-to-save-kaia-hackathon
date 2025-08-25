'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ 
  children, 
  className,
  variant = 'default',
  size = 'md'
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-[#F8F9FA] text-[#6C757D]',
    success: 'bg-[#28A745] text-white',
    warning: 'bg-[#FFC107] text-white',
    danger: 'bg-[#DC3545] text-white',
    info: 'bg-[#4169E1] text-white'
  };

  const sizeClasses = {
    sm: 'text-[10px] px-[6px] py-[2px]',
    md: 'text-[11px] px-[8px] py-[3px]',
    lg: 'text-[12px] px-[10px] py-[4px]'
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-full font-bold',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}