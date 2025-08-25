'use client';

import { create } from 'zustand';
import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DappPortalSDKType, initDappPortalSDK } from '@/lib/dapp-portal-sdk';
import { initializeLiff } from '@/lib/liff';
import { ethers } from 'ethers';
import { Transaction } from '@/types/wallet';

// Zustand Store
interface WalletSdkState {
  sdk: DappPortalSDKType | null;
  setSdk: (sdk: DappPortalSDKType | null) => void;
  account: string | null;
  setAccount: (account: string | null) => void;
  balance: string;
  setBalance: (balance: string) => void;
  chainId: number | null;
  setChainId: (chainId: number | null) => void;
}

export const useWalletSdkStore = create<WalletSdkState>((set) => ({
  sdk: null,
  setSdk: (sdk) => set({ sdk }),
  account: null,
  setAccount: (account) => set({ account }),
  balance: '0',
  setBalance: (balance) => set({ balance }),
  chainId: null,
  setChainId: (chainId) => set({ chainId })
}));

// 보안 초기화 Hook
export const useKaiaWalletSecurity = () => {
  const { setSdk, setAccount, setBalance, setChainId } = useWalletSdkStore();
  
  return useQuery({
    queryKey: ['wallet', 'sdk'],
    queryFn: async () => {
      // LIFF 초기화
      const liffReady = await initializeLiff();
      if (!liffReady) {
        throw new Error('LIFF 초기화 실패');
      }
      
      // DappPortal SDK 초기화
      const sdk = await initDappPortalSDK();
      if (!sdk) {
        throw new Error('DappPortal SDK 초기화 실패');
      }
      
      setSdk(sdk);
      
      // 기존 연결 확인
      try {
        const provider = sdk.getWalletProvider();
        const accounts = await provider.request({ method: 'kaia_accounts' }) as string[];
        
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          
          // 잔액 조회
          const balance = await provider.request({
            method: 'kaia_getBalance',
            params: [accounts[0], 'latest']
          });
          setBalance(String(balance));
          
          // 체인 ID 조회
          const chainId = await provider.request({ method: 'eth_chainId' });
          setChainId(Number(chainId));
        }
      } catch (error) {
        console.log('기존 연결 없음');
      }
      
      return true;
    },
    retry: 1
  });
};

// 메인 지갑 Hook
export const useKaiaWalletSdk = () => {
  const { sdk, account, balance, chainId, setAccount, setBalance, setChainId } = useWalletSdkStore();
  
  // SDK가 없으면 초기화 대기
  if (!sdk) {
    return {
      isInitialized: false,
      account: null,
      balance: '0',
      chainId: null,
      getAccount: async () => null,
      requestAccount: async () => null,
      connectAndSign: async () => ['', ''],
      getBalance: async () => '0',
      getUSDTBalance: async () => '0',
      disconnectWallet: async () => {},
      sendTransaction: async () => '',
      switchNetwork: async () => {},
      walletProvider: null
    };
  }
  
  const walletProvider = sdk.getWalletProvider();
  
  // 계정 조회
  const getAccount = useCallback(async () => {
    try {
      const addresses = await walletProvider.request({ method: 'kaia_accounts' }) as string[];
      const addr = addresses[0] || null;
      setAccount(addr);
      return addr;
    } catch (error) {
      console.error('계정 조회 실패:', error);
      return null;
    }
  }, [walletProvider, setAccount]);
  
  // 계정 연결 요청
  const requestAccount = useCallback(async () => {
    try {
      const addresses = await walletProvider.request({ method: 'kaia_requestAccounts' }) as string[];
      const addr = addresses[0];
      setAccount(addr);
      
      // 연결 후 잔액 조회
      if (addr) {
        const bal = await walletProvider.request({
          method: 'kaia_getBalance',
          params: [addr, 'latest']
        });
        setBalance(String(bal));
        
        // 체인 ID 조회
        const chain = await walletProvider.request({ method: 'eth_chainId' });
        setChainId(Number(chain));
      }
      
      return addr;
    } catch (error) {
      console.error('계정 연결 실패:', error);
      throw error;
    }
  }, [walletProvider, setAccount, setBalance, setChainId]);
  
  // 메시지 서명
  const connectAndSign = useCallback(
    async (msg: string) => {
      try {
        const [account, signature] = await walletProvider.request({
          method: 'kaia_connectAndSign',
          params: [msg]
        }) as string[];
        return [account, signature];
      } catch (error) {
        console.error('서명 실패:', error);
        throw error;
      }
    },
    [walletProvider]
  );
  
  // 잔액 조회
  const getBalance = useCallback(
    async (address?: string) => {
      try {
        const addr = address || account;
        if (!addr) return '0';
        
        const balance = await walletProvider.request({
          method: 'kaia_getBalance',
          params: [addr, 'latest']
        });
        
        const balanceStr = String(balance);
        setBalance(balanceStr);
        return balanceStr;
      } catch (error) {
        console.error('잔액 조회 실패:', error);
        return '0';
      }
    },
    [walletProvider, account, setBalance]
  );
  
  // USDT 잔액 조회
  const getUSDTBalance = useCallback(
    async (address?: string) => {
      try {
        const addr = address || account;
        if (!addr) return '0';
        
        const usdtAddress = process.env.NEXT_PUBLIC_USDT_ADDRESS;
        if (!usdtAddress) return '0';
        
        // ERC20 balanceOf ABI
        const abiCoder = ethers.AbiCoder.defaultAbiCoder();
        const data = abiCoder.encode(['address'], [addr]);
        const balanceOfSelector = '0x70a08231'; // balanceOf(address)
        
        const result = await walletProvider.request({
          method: 'eth_call',
          params: [
            {
              to: usdtAddress,
              data: balanceOfSelector + data.slice(2)
            },
            'latest'
          ]
        });
        
        return result;
      } catch (error) {
        console.error('USDT 잔액 조회 실패:', error);
        return '0';
      }
    },
    [walletProvider, account]
  );
  
  // 지갑 연결 해제
  const disconnectWallet = useCallback(async () => {
    try {
      await walletProvider.disconnectWallet();
      setAccount(null);
      setBalance('0');
      setChainId(null);
      
      // 페이지 새로고침 대신 상태만 초기화
      window.dispatchEvent(new CustomEvent('wallet-disconnected'));
    } catch (error) {
      console.error('연결 해제 실패:', error);
    }
  }, [walletProvider, setAccount, setBalance, setChainId]);
  
  // 트랜잭션 전송
  const sendTransaction = useCallback(
    async (params: Transaction) => {
      try {
        const txHash = await walletProvider.request({
          method: 'kaia_sendTransaction',
          params: [params]
        });
        return txHash;
      } catch (error) {
        // Kaia 메소드 실패 시 Ethereum 메소드 시도
        try {
          const txHash = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [params]
          });
          return txHash;
        } catch (ethError) {
          console.error('트랜잭션 전송 실패:', ethError);
          throw ethError;
        }
      }
    },
    [walletProvider]
  );
  
  // 네트워크 전환
  const switchNetwork = useCallback(
    async (chainId: number) => {
      try {
        await walletProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }]
        });
        setChainId(chainId);
      } catch (error: any) {
        // 네트워크가 없으면 추가
        if (error.code === 4902) {
          const networkParams = getNetworkParams(chainId);
          if (networkParams) {
            await walletProvider.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams]
            });
            setChainId(chainId);
          }
        } else {
          throw error;
        }
      }
    },
    [walletProvider, setChainId]
  );
  
  return {
    isInitialized: true,
    account,
    balance,
    chainId,
    getAccount,
    requestAccount,
    connectAndSign,
    getBalance,
    getUSDTBalance,
    disconnectWallet,
    sendTransaction,
    switchNetwork,
    walletProvider
  };
};

// 네트워크 파라미터
function getNetworkParams(chainId: number) {
  switch (chainId) {
    case 1001: // Kairos Testnet
      return {
        chainId: '0x3e9',
        chainName: 'Kairos Testnet',
        nativeCurrency: {
          name: 'KAIA',
          symbol: 'KAIA',
          decimals: 18
        },
        rpcUrls: ['https://public-en-kairos.node.kaia.io'],
        blockExplorerUrls: ['https://kairos.kaiascope.com']
      };
    case 8217: // Cypress Mainnet
      return {
        chainId: '0x2019',
        chainName: 'Kaia Mainnet',
        nativeCurrency: {
          name: 'KAIA',
          symbol: 'KAIA',
          decimals: 18
        },
        rpcUrls: ['https://public-en-cypress.klaytn.net'],
        blockExplorerUrls: ['https://kaiascope.com']
      };
    default:
      return null;
  }
}