'use client';

import { useState, useEffect } from 'react';
import { useKaiaWalletSdk } from '@/hooks/useWalletSdk';
import { shortenAddress, formatKaia, formatUSDT } from '@/utils/format';
import { Button } from '@/components/ui/Button';

export default function WalletButton() {
  const {
    isInitialized,
    account,
    balance,
    chainId,
    requestAccount,
    disconnectWallet,
    getUSDTBalance,
    switchNetwork
  } = useKaiaWalletSdk();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [showDetails, setShowDetails] = useState(false);

  // USDT 잔액 조회
  useEffect(() => {
    if (account) {
      getUSDTBalance().then(setUsdtBalance);
    }
  }, [account, getUSDTBalance]);

  // 네트워크 체크
  useEffect(() => {
    if (chainId && chainId !== 1001) {
      // Kairos 테스트넷이 아니면 전환 요청
      switchNetwork(1001);
    }
  }, [chainId, switchNetwork]);

  const handleConnect = async () => {
    if (!isInitialized) return;
    
    setIsConnecting(true);
    try {
      await requestAccount();
    } catch (error) {
      console.error('지갑 연결 실패:', error);
      alert('지갑 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = confirm('지갑 연결을 해제하시겠습니까?');
    if (confirmed) {
      await disconnectWallet();
      setShowDetails(false);
    }
  };

  if (!isInitialized) {
    return (
      <Button variant="primary" disabled>
        <span className="animate-pulse">초기화 중...</span>
      </Button>
    );
  }

  if (account) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{shortenAddress(account)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDetails && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">지갑 주소</p>
              <p className="text-sm font-mono break-all">{account}</p>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">KAIA 잔액</span>
                <span className="text-sm font-medium">{formatKaia(balance)} KAIA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">USDT 잔액</span>
                <span className="text-sm font-medium">{formatUSDT(usdtBalance)} USDT</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-500">네트워크</span>
                <span className="text-sm font-medium">
                  {chainId === 1001 ? 'Kairos Testnet' : `Chain ${chainId}`}
                </span>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                연결 해제
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? '연결 중...' : '지갑 연결'}
    </Button>
  );
}