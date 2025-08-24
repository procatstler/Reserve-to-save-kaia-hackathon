'use client';

import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Container({ 
  children, 
  className,
  maxWidth = 'full' 
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto px-4',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}