'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress external extension errors (like MetaMask JSON-RPC errors)
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes('JSON-RPC') ||
        event.message.includes('MetaMask') ||
        event.message.includes('inject.js') ||
        event.filename?.includes('chrome-extension://') ||
        event.filename?.includes('moz-extension://')
      ) {
        event.preventDefault();
        // Silently suppress the error without logging
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason?.message?.includes('JSON-RPC') ||
        event.reason?.message?.includes('MetaMask') ||
        event.reason?.code === -32603
      ) {
        event.preventDefault();
        // Silently suppress the rejection without logging
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}