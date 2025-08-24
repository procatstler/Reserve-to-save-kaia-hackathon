'use client';

import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { MOBILE_CONTAINER } from '@/src/constants';
import { useResponsiveContainer } from '@/src/hooks/useResponsiveContainer';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gradient' | 'gray';
}

export default function MobileContainer({ 
  children, 
  className,
  background = 'white' 
}: MobileContainerProps) {
  const dimensions = useResponsiveContainer();

  const backgroundClasses = {
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-[#1DB954] to-[#1AA34A]',
    gray: 'bg-[#F8F9FA]'
  };

  // 모바일에서는 전체 화면, 데스크탑에서는 중앙 정렬
  if (dimensions.isMobile) {
    return (
      <div 
        className={cn(
          'relative w-full h-screen mobile-container',
          backgroundClasses[background],
          className
        )}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </div>
    );
  }

  // 태블릿/데스크탑 뷰
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div 
        className={cn(
          'relative shadow-2xl mobile-container transition-transform duration-300',
          backgroundClasses[background],
          className
        )}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          borderRadius: `${MOBILE_CONTAINER.borderRadius}px`,
          transform: `scale(${dimensions.scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div className="w-full h-full overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}