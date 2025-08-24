'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/src/lib/utils';
import { ROUTES } from '@/src/constants';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon?: string;
  route: string;
}

const navItems: NavItem[] = [
  { 
    id: 'home', 
    label: '홈', 
    icon: '🏠', 
    activeIcon: '🏠',
    route: ROUTES.campaigns 
  },
  { 
    id: 'my-participation', 
    label: '내 참여', 
    icon: '💰', 
    activeIcon: '💰',
    route: ROUTES.myParticipation 
  },
  { 
    id: 'history', 
    label: '내역', 
    icon: '📋', 
    activeIcon: '📋',
    route: '/history' 
  },
  { 
    id: 'profile', 
    label: '프로필', 
    icon: '👤', 
    activeIcon: '👤',
    route: '/profile' 
  },
];

interface BottomNavigationProps {
  className?: string;
  activeItem?: string;
}

export default function BottomNavigation({ className, activeItem }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (route: string) => {
    if (route.startsWith('/')) {
      router.push(route);
    }
  };

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-white border-t border-[#E9ECEF] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]',
      className
    )}>
      {/* Safe area padding for iOS */}
      <div className="h-[56px] sm:h-[60px] pb-safe">
        <div className="flex h-full">
          {navItems.map((item) => {
            const isActive = activeItem === item.id || pathname === item.route;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.route)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-[4px]',
                  'transition-all duration-200 relative',
                  'hover:bg-gray-50 active:bg-gray-100',
                  isActive && 'after:absolute after:top-0 after:left-[20%] after:right-[20%] after:h-[2px] after:bg-[#1DB954]'
                )}
                disabled={!item.route.startsWith('/')}
              >
                {/* Icon with animation */}
                <span className={cn(
                  'text-[22px] transition-transform duration-200',
                  isActive && 'transform scale-110'
                )}>
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                </span>
                
                {/* Label */}
                <span className={cn(
                  'text-[10px] sm:text-[11px] transition-all duration-200',
                  isActive 
                    ? 'text-[#1DB954] font-bold' 
                    : 'text-[#6C757D] font-medium'
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-[4px] w-[4px] h-[4px] bg-[#1DB954] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}