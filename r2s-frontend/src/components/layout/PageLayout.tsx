'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import MobileContainer from './MobileContainer';
import Header, { type HeaderProps } from './Header';
import BottomNavigation from './BottomNavigation';

interface PageLayoutProps {
  children: ReactNode;
  header?: HeaderProps;
  showBottomNav?: boolean;
  activeNavItem?: 'home' | 'my-participation';
  containerBackground?: 'white' | 'gradient' | 'gray';
  className?: string;
  contentClassName?: string;
}

export default function PageLayout({
  children,
  header,
  showBottomNav = false,
  activeNavItem,
  containerBackground = 'white',
  className,
  contentClassName
}: PageLayoutProps) {
  // 헤더 높이 계산
  const getHeaderHeight = () => {
    if (!header) return 0;
    if (header.subtitle) return 88;
    if (header.height === 'large') return 88;
    if (header.height === 'compact') return 48;
    return 64; // default
  };

  const headerHeight = getHeaderHeight();
  const bottomNavHeight = showBottomNav ? 56 : 0;

  return (
    <MobileContainer background={containerBackground} className={className}>
      {/* Header */}
      {header && <Header {...header} />}
      
      {/* Main Content */}
      <div 
        className={cn(
          'relative w-full',
          contentClassName
        )}
        style={{
          paddingTop: header?.fixed !== false ? `${headerHeight}px` : 0,
          paddingBottom: `${bottomNavHeight}px`,
          minHeight: `calc(100% - ${headerHeight + bottomNavHeight}px)`
        }}
      >
        {children}
      </div>
      
      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomNavigation activeItem={activeNavItem} />
      )}
    </MobileContainer>
  );
}