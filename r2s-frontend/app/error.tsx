'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-500 to-green-600 p-4">
      <div className="rounded-lg bg-white/10 backdrop-blur-sm p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">문제가 발생했습니다</h2>
        <p className="mb-6 text-white/80">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-white px-6 py-3 font-semibold text-green-600 hover:bg-gray-100 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}