"use client";

import { ReactNode, useEffect, useState } from "react";
import { useKaiaWalletSecurity } from "@/hooks/useWalletSdk";

export interface BootstrapProps {
  className?: string;
  children?: ReactNode;
}

export function Bootstrap({ className, children }: BootstrapProps) {
  const { isSuccess, isLoading, error } = useKaiaWalletSecurity();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 뒤로가기 방지
    const preventGoBack = () => {
      if (window.location.pathname === '/') {
        const isConfirmed = confirm('정말로 나가시겠습니까? 진행 중인 내용이 저장되지 않을 수 있습니다.');
        if (!isConfirmed) {
          history.pushState(null, '', window.location.pathname);
        }
      }
    };

    window.addEventListener('popstate', preventGoBack);
    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  // 에러 시 재시도
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-gray-600">LINE Mini dApp 초기화 중...</p>
        <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">초기화 실패</h2>
          <p className="text-gray-600 mb-4">
            앱을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            재시도 횟수: {retryCount}/3
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return <div className={className}>{isSuccess && children}</div>;
}

export default Bootstrap;