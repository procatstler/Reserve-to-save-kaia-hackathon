'use client';

import { useState, useEffect } from 'react';
import { MOBILE_CONTAINER } from '@/src/constants';

interface ResponsiveDimensions {
  width: number;
  height: number;
  scale: number;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

export function useResponsiveContainer(): ResponsiveDimensions {
  const [dimensions, setDimensions] = useState<ResponsiveDimensions>({
    width: MOBILE_CONTAINER.baseWidth,
    height: MOBILE_CONTAINER.baseHeight,
    scale: 1,
    isDesktop: false,
    isMobile: true,
    isTablet: false
  });

  useEffect(() => {
    const calculateDimensions = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // 디바이스 타입 판별
      const isMobile = viewportWidth < 768;
      const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
      const isDesktop = viewportWidth >= 1024;
      
      // 뷰포트 패딩 고려
      const padding = isMobile ? 0 : MOBILE_CONTAINER.padding * 2;
      const availableHeight = viewportHeight - padding;
      const availableWidth = viewportWidth - padding;
      
      // 기본값 설정
      let targetWidth = MOBILE_CONTAINER.baseWidth;
      let targetHeight = MOBILE_CONTAINER.baseHeight;
      
      // 모바일: 전체 화면 사용
      if (isMobile) {
        targetWidth = Math.min(viewportWidth, MOBILE_CONTAINER.maxWidth);
        targetHeight = viewportHeight;
      }
      // 태블릿/데스크탑: 비율 유지하며 스케일 조정
      else {
        // 뷰포트에 맞춰 높이 조정
        if (availableHeight < MOBILE_CONTAINER.baseHeight) {
          const ratio = availableHeight / MOBILE_CONTAINER.baseHeight;
          targetHeight = availableHeight;
          targetWidth = MOBILE_CONTAINER.baseWidth * ratio;
        } else {
          targetHeight = Math.min(availableHeight, MOBILE_CONTAINER.maxHeight);
          // 높이에 맞춰 너비 비율 조정
          const ratio = targetHeight / MOBILE_CONTAINER.baseHeight;
          targetWidth = MOBILE_CONTAINER.baseWidth * ratio;
        }
      }
      
      // 제약 적용
      targetWidth = Math.max(MOBILE_CONTAINER.minWidth, 
                            Math.min(targetWidth, MOBILE_CONTAINER.maxWidth));
      targetHeight = Math.max(MOBILE_CONTAINER.minHeight, 
                             Math.min(targetHeight, MOBILE_CONTAINER.maxHeight));
      
      // 스케일 계산
      let scale = 1;
      if (!isMobile) {
        const widthScale = availableWidth / targetWidth;
        const heightScale = availableHeight / targetHeight;
        scale = Math.min(1.5, Math.min(widthScale, heightScale));
      }
      
      setDimensions({
        width: targetWidth,
        height: targetHeight,
        scale,
        isDesktop,
        isMobile,
        isTablet
      });
    };

    calculateDimensions();
    
    const handleResize = () => {
      requestAnimationFrame(calculateDimensions);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // 초기 로드 시 재계산
    setTimeout(calculateDimensions, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return dimensions;
}