'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BackIcon, CloseIcon } from '@/components/icons/HeaderIcons';

export interface HeaderProps {
  // 기본 속성
  title?: string;
  subtitle?: string;
  badge?: string | number;
  
  // 액션 버튼
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  
  // 스타일링
  variant?: 'default' | 'gradient' | 'transparent' | 'white';
  className?: string;
  fixed?: boolean;
  height?: 'default' | 'large' | 'compact';
}

export default function Header({ 
  title,
  subtitle,
  badge,
  showBack = false,
  showClose = false,
  onBack,
  onClose,
  leftAction,
  rightAction,
  variant = 'gradient',
  className,
  fixed = true,
  height = 'default'
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/campaigns');
    }
  };

  // 스타일 변형
  const variantStyles = {
    default: 'bg-white border-b border-[#E9ECEF]',
    gradient: 'bg-gradient-to-r from-[#1DB954] to-[#1AA34A]',
    transparent: 'bg-transparent',
    white: 'bg-white'
  };

  const heightStyles = {
    compact: 'h-[48px]',
    default: 'h-[64px]',
    large: 'h-[88px]'
  };

  const textColor = (variant === 'gradient' || variant === 'transparent') ? 'text-white' : 'text-[#212529]';
  const iconColor = (variant === 'gradient' || variant === 'transparent') ? 'white' : '#212529';

  // 서브타이틀이 있는 경우 높이 조정
  const actualHeight = subtitle ? 'h-[88px]' : heightStyles[height];

  return (
    <header 
      className={cn(
        actualHeight,
        variantStyles[variant],
        fixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative',
        'transition-all duration-300',
        className
      )}
    >
      {/* 메인 헤더 영역 */}
      <div className={cn(
        'flex items-center justify-between',
        'px-[16px] sm:px-[20px] md:px-[24px]', // 반응형 패딩
        subtitle ? 'h-[64px]' : 'h-full'
      )}>
        {/* 왼쪽 영역 - 최소 너비 보장 */}
        <div className="flex items-center min-w-[44px]">
          {leftAction ? (
            leftAction
          ) : showBack ? (
            <button 
              onClick={handleBack}
              className="w-[44px] h-[44px] flex items-center justify-center -ml-[10px] rounded-full hover:bg-white/10 transition-colors"
              aria-label="뒤로 가기"
            >
              <BackIcon color={iconColor} />
            </button>
          ) : (
            <div className="w-[44px]" />
          )}
        </div>

        {/* 중앙 타이틀 영역 - 적절한 패딩으로 중앙 정렬 */}
        <div className="flex-1 flex items-center justify-center px-[16px]">
          {title && (
            <div className="flex items-center gap-[8px]">
              <h1 className={cn(
                'text-[17px] sm:text-[18px] font-semibold text-center tracking-[-0.01em]',
                textColor
              )}>
                {title}
              </h1>
              {badge && (
                <span className={cn(
                  'px-[10px] py-[3px] rounded-full text-[11px] font-bold',
                  variant === 'gradient' || variant === 'transparent' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-[#DC3545] text-white'
                )}>
                  {badge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽 영역 - 최소 너비 보장 */}
        <div className="flex items-center min-w-[44px]">
          {rightAction ? (
            rightAction
          ) : showClose ? (
            <button 
              onClick={handleClose}
              className="w-[44px] h-[44px] flex items-center justify-center -mr-[10px] rounded-full hover:bg-white/10 transition-colors"
              aria-label="닫기"
            >
              <CloseIcon color={iconColor} />
            </button>
          ) : (
            <div className="w-[44px]" />
          )}
        </div>
      </div>
      
      {/* 서브타이틀 영역 */}
      {subtitle && (
        <div className="px-[20px] pb-[12px]">
          <p className={cn('text-[14px] text-center', textColor, 'opacity-90')}>
            {subtitle}
          </p>
        </div>
      )}
    </header>
  );
}