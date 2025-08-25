'use client';

import { useRouter } from 'next/navigation';

interface R2SHeaderProps {
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function R2SHeader({ 
  showBack = false, 
  showClose = false, 
  onBack, 
  onClose,
  className = ''
}: R2SHeaderProps) {
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
      router.push('/');
    }
  };

  return (
    <div className={`absolute top-0 left-0 right-0 h-[44px] bg-gradient-to-br from-[#1DB954] to-[#1AA34A] z-50 ${className}`}>
      <div className="flex items-center justify-between h-full px-[20px]">
        {/* 뒤로가기 버튼 */}
        {showBack && (
          <button 
            onClick={handleBack}
            className="w-[24px] h-[24px] flex items-center justify-center text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}
        
        {/* 좌측 여백 */}
        {!showBack && <div className="w-[24px]"></div>}

        {/* R2S 로고 */}
        <div className="flex-1 text-center">
          <h1 className="text-white text-[16px] font-medium">R2S - Reserve to Save</h1>
        </div>

        {/* 닫기 버튼 */}
        {showClose && (
          <button 
            onClick={handleClose}
            className="w-[24px] h-[24px] flex items-center justify-center text-white text-[18px] font-light"
          >
            ×
          </button>
        )}
        
        {/* 우측 여백 */}
        {!showClose && <div className="w-[24px]"></div>}
      </div>
    </div>
  );
}