import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKaiaWalletSdk, useKaiaWalletSecurity, useWalletSdkStore } from '../useWalletSdk';
import React from 'react';

// Mock dependencies
jest.mock('@/lib/liff', () => ({
  initializeLiff: jest.fn().mockResolvedValue(true)
}));

jest.mock('@/lib/dapp-portal-sdk', () => ({
  initDappPortalSDK: jest.fn()
}));

describe('Wallet SDK Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useWalletSdkStore', () => {
    it('should have initial state', () => {
      const { result } = renderHook(() => useWalletSdkStore());

      expect(result.current.sdk).toBeNull();
      expect(result.current.account).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.chainId).toBeNull();
    });

    it('should update SDK', () => {
      const { result } = renderHook(() => useWalletSdkStore());
      const mockSdk = { getWalletProvider: jest.fn() } as any;

      act(() => {
        result.current.setSdk(mockSdk);
      });

      expect(result.current.sdk).toBe(mockSdk);
    });

    it('should update account', () => {
      const { result } = renderHook(() => useWalletSdkStore());

      act(() => {
        result.current.setAccount('0x123');
      });

      expect(result.current.account).toBe('0x123');
    });
  });

  describe('useKaiaWalletSecurity', () => {
    it('should initialize LIFF and SDK successfully', async () => {
      const mockSdk = {
        getWalletProvider: jest.fn().mockReturnValue({
          request: jest.fn()
            .mockResolvedValueOnce([]) // kaia_accounts
        })
      };

      const { initDappPortalSDK } = require('@/lib/dapp-portal-sdk');
      initDappPortalSDK.mockResolvedValue(mockSdk);

      const { result } = renderHook(() => useKaiaWalletSecurity(), { wrapper });

      // Wait for the query to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle initialization errors', async () => {
      const { initializeLiff } = require('@/lib/liff');
      initializeLiff.mockResolvedValue(false);

      const { result } = renderHook(() => useKaiaWalletSecurity(), { wrapper });

      // Wait for the query to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useKaiaWalletSdk', () => {
    it('should return uninitialized state when SDK is not ready', () => {
      const { result } = renderHook(() => useKaiaWalletSdk());

      expect(result.current.isInitialized).toBe(false);
      expect(result.current.account).toBeNull();
      expect(result.current.balance).toBe('0');
      expect(result.current.chainId).toBeNull();
    });

    it('should handle account connection', async () => {
      const mockProvider = {
        request: jest.fn()
          .mockResolvedValueOnce(['0xTestAddress']) // kaia_requestAccounts
          .mockResolvedValueOnce('1000000000000000000') // kaia_getBalance
          .mockResolvedValueOnce('0x3e9') // eth_chainId (1001 in hex)
      };

      const mockSdk = {
        getWalletProvider: jest.fn().mockReturnValue(mockProvider)
      };

      // Set up the store with SDK
      const { result: storeResult } = renderHook(() => useWalletSdkStore());
      act(() => {
        storeResult.current.setSdk(mockSdk as any);
      });

      // Now test the main hook
      const { result } = renderHook(() => useKaiaWalletSdk());

      expect(result.current.isInitialized).toBe(true);

      await act(async () => {
        const account = await result.current.requestAccount();
        expect(account).toBe('0xTestAddress');
      });

      expect(mockProvider.request).toHaveBeenCalledWith({ method: 'kaia_requestAccounts' });
    });

    it('should handle wallet disconnection', async () => {
      const mockProvider = {
        request: jest.fn(),
        disconnectWallet: jest.fn()
      };

      const mockSdk = {
        getWalletProvider: jest.fn().mockReturnValue(mockProvider)
      };

      const { result: storeResult } = renderHook(() => useWalletSdkStore());
      act(() => {
        storeResult.current.setSdk(mockSdk as any);
        storeResult.current.setAccount('0xTestAddress');
        storeResult.current.setBalance('1000');
        storeResult.current.setChainId(1001);
      });

      const { result } = renderHook(() => useKaiaWalletSdk());

      await act(async () => {
        await result.current.disconnectWallet();
      });

      expect(mockProvider.disconnectWallet).toHaveBeenCalled();
      expect(storeResult.current.account).toBeNull();
      expect(storeResult.current.balance).toBe('0');
      expect(storeResult.current.chainId).toBeNull();
    });

    it('should send transaction', async () => {
      const mockProvider = {
        request: jest.fn().mockResolvedValue('0xTransactionHash')
      };

      const mockSdk = {
        getWalletProvider: jest.fn().mockReturnValue(mockProvider)
      };

      const { result: storeResult } = renderHook(() => useWalletSdkStore());
      act(() => {
        storeResult.current.setSdk(mockSdk as any);
      });

      const { result } = renderHook(() => useKaiaWalletSdk());

      const txParams = {
        from: '0xFrom',
        to: '0xTo',
        value: '0x0',
        data: '0x'
      };

      await act(async () => {
        const txHash = await result.current.sendTransaction(txParams);
        expect(txHash).toBe('0xTransactionHash');
      });

      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'kaia_sendTransaction',
        params: [txParams]
      });
    });

    it('should fallback to eth_sendTransaction when kaia method fails', async () => {
      const mockProvider = {
        request: jest.fn()
          .mockRejectedValueOnce(new Error('Kaia method not supported'))
          .mockResolvedValueOnce('0xTransactionHash')
      };

      const mockSdk = {
        getWalletProvider: jest.fn().mockReturnValue(mockProvider)
      };

      const { result: storeResult } = renderHook(() => useWalletSdkStore());
      act(() => {
        storeResult.current.setSdk(mockSdk as any);
      });

      const { result } = renderHook(() => useKaiaWalletSdk());

      const txParams = {
        from: '0xFrom',
        to: '0xTo',
        value: '0x0',
        data: '0x'
      };

      await act(async () => {
        const txHash = await result.current.sendTransaction(txParams);
        expect(txHash).toBe('0xTransactionHash');
      });

      expect(mockProvider.request).toHaveBeenCalledTimes(2);
      expect(mockProvider.request).toHaveBeenNthCalledWith(2, {
        method: 'eth_sendTransaction',
        params: [txParams]
      });
    });
  });
});