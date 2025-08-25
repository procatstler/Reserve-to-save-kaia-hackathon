import { initDappPortalSDK } from '../dapp-portal-sdk';

// Mock @linenext/dapp-portal-sdk module
jest.mock('@linenext/dapp-portal-sdk', () => ({
  __esModule: true,
  default: {
    init: jest.fn()
  }
}));

describe('DappPortal SDK', () => {
  const mockClientId = 'test-client-id';
  const mockChainId = '1001';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_CLIENT_ID = mockClientId;
    process.env.NEXT_PUBLIC_CHAIN_ID = mockChainId;
  });

  describe('initDappPortalSDK', () => {
    it('should initialize SDK successfully with correct parameters', async () => {
      const mockSdk = { 
        getWalletProvider: jest.fn(),
        getProvider: jest.fn()
      };
      const dappPortalSdk = require('@linenext/dapp-portal-sdk').default;
      dappPortalSdk.init.mockResolvedValue(mockSdk);

      const result = await initDappPortalSDK();

      expect(dappPortalSdk.init).toHaveBeenCalledWith({
        clientId: mockClientId,
        chainId: mockChainId
      });
      expect(result).toBe(mockSdk);
    });

    it('should throw error when CLIENT_ID is not set', async () => {
      delete process.env.NEXT_PUBLIC_CLIENT_ID;

      await expect(initDappPortalSDK()).rejects.toThrow('DappPortal Client ID가 설정되지 않았습니다');
    });

    it('should use default chainId when not set', async () => {
      delete process.env.NEXT_PUBLIC_CHAIN_ID;
      const mockSdk = { 
        getWalletProvider: jest.fn(),
        getProvider: jest.fn()
      };
      const dappPortalSdk = require('@linenext/dapp-portal-sdk').default;
      dappPortalSdk.init.mockResolvedValue(mockSdk);

      const result = await initDappPortalSDK();

      expect(dappPortalSdk.init).toHaveBeenCalledWith({
        clientId: mockClientId,
        chainId: '1001' // default value
      });
      expect(result).toBe(mockSdk);
    });

    it('should handle initialization errors', async () => {
      const dappPortalSdk = require('@linenext/dapp-portal-sdk').default;
      dappPortalSdk.init.mockRejectedValue(new Error('SDK init failed'));

      await expect(initDappPortalSDK()).rejects.toThrow('SDK init failed');
    });
  });
});