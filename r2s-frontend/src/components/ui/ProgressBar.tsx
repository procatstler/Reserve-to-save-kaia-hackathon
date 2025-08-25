'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  color?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function ProgressBar({ 
  value, 
  max = 100,
  className,
  barClassName,
  variant = 'default',
  color,
  size = 'md',
  animated = false
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    default: 'bg-gradient-to-r from-[#00C73C] to-[#00A332]',
    gradient: 'bg-gradient-to-r from-[#1DB954] to-[#1AA34A]',
    success: 'bg-gradient-to-r from-[#28A745] to-[#1E7E34]',
    warning: 'bg-gradient-to-r from-[#FFC107] to-[#FF9800]',
    danger: 'bg-gradient-to-r from-[#DC3545] to-[#C82333]'
  };
  
  // Use color prop if provided, otherwise fall back to variant
  const barColor = color ? colorClasses[color] : colorClasses[variant as keyof typeof colorClasses] || colorClasses.default;

  const sizeClasses = {
    sm: 'h-[2px]',
    md: 'h-[4px]',
    lg: 'h-[6px]'
  };

  return (
    <div className={cn(
      'relative bg-[#E9ECEF] rounded-full overflow-hidden',
      sizeClasses[size],
      className
    )}>
      <div 
        className={cn(
          'absolute left-0 top-0 h-full rounded-full transition-all duration-500',
          barColor,
          animated && 'animate-pulse',
          barClassName
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}