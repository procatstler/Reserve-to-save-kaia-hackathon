'use client';

import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className,
  onClick,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const variantClasses = {
    default: 'bg-white',
    outlined: 'bg-white border border-[#E9ECEF]',
    elevated: 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div 
      className={cn(
        'rounded-[16px] transition-all',
        variantClasses[variant],
        paddingClasses[padding],
        onClick && 'cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
}