"use client";

let dappPortalSdk: any = null;

// Dynamic import to avoid SSR issues
if (typeof window !== 'undefined') {
  import('@linenext/dapp-portal-sdk').then((module) => {
    dappPortalSdk = module.default;
  }).catch((error) => {
    console.error('Failed to load DappPortal SDK:', error);
  });
}

export type DappPortalSDKType = any;

// SDK 초기화 헬퍼
export async function initDappPortalSDK() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  
  if (!clientId) {
    throw new Error('DappPortal Client ID가 설정되지 않았습니다');
  }
  
  // Wait for SDK to load
  if (!dappPortalSdk) {
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (dappPortalSdk) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 5000);
    });
  }
  
  if (!dappPortalSdk) {
    throw new Error('DappPortal SDK failed to load');
  }
  
  try {
    const sdk = await dappPortalSdk.init({
      clientId,
      chainId: String(chainId || '1001'),
      // 개발 환경에서는 metrics 비활성화
      disableMetrics: process.env.NODE_ENV === 'development'
    });
    
    return sdk;
  } catch (error) {
    console.error('DappPortal SDK 초기화 실패:', error);
    // 개발 환경에서는 mock SDK 반환
    if (process.env.NODE_ENV === 'development') {
      return {
        requestAccount: async () => '0x1234567890123456789012345678901234567890',
        sendTransaction: async () => ({ hash: '0xmocktxhash' }),
        getBalance: async () => '1000000000000000000',
        switchChain: async () => {},
        isConnected: () => false
      };
    }
    throw error;
  }
}

export { dappPortalSdk };