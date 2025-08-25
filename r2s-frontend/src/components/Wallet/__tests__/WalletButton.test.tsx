import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletButton from '../WalletButton';

// Mock hooks
jest.mock('@/hooks/useWalletSdk', () => ({
  useKaiaWalletSdk: jest.fn()
}));

jest.mock('@/utils/format', () => ({
  shortenAddress: jest.fn((addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''),
  formatKaia: jest.fn((val) => '1.0000'),
  formatUSDT: jest.fn((val) => '100.00')
}));

describe('WalletButton Component', () => {
  const mockRequestAccount = jest.fn();
  const mockDisconnectWallet = jest.fn();
  const mockGetUSDTBalance = jest.fn();
  const mockSwitchNetwork = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show initializing state when not initialized', () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: false,
      account: null,
      balance: '0',
      chainId: null,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    render(<WalletButton />);

    expect(screen.getByText('초기화 중...')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show connect button when not connected', () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: null,
      balance: '0',
      chainId: null,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    render(<WalletButton />);

    expect(screen.getByText('지갑 연결')).toBeInTheDocument();
  });

  it('should handle wallet connection', async () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: null,
      balance: '0',
      chainId: null,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockRequestAccount.mockResolvedValue('0x1234567890123456789012345678901234567890');

    render(<WalletButton />);

    const connectButton = screen.getByText('지갑 연결');
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockRequestAccount).toHaveBeenCalled();
    });
  });

  it('should show connected account', () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    const { shortenAddress } = require('@/utils/format');
    
    const mockAccount = '0x1234567890123456789012345678901234567890';
    shortenAddress.mockReturnValue('0x1234...7890');
    
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: mockAccount,
      balance: '1000000000000000000',
      chainId: 1001,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockGetUSDTBalance.mockResolvedValue('100000000');

    render(<WalletButton />);

    expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
  });

  it('should toggle wallet details on click', () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    const { shortenAddress } = require('@/utils/format');
    
    const mockAccount = '0x1234567890123456789012345678901234567890';
    shortenAddress.mockReturnValue('0x1234...7890');
    
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: mockAccount,
      balance: '1000000000000000000',
      chainId: 1001,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockGetUSDTBalance.mockResolvedValue('100000000');

    render(<WalletButton />);

    const accountButton = screen.getByText('0x1234...7890');
    fireEvent.click(accountButton.parentElement!);

    // Check if details are shown
    expect(screen.getByText('지갑 주소')).toBeInTheDocument();
    expect(screen.getByText('KAIA 잔액')).toBeInTheDocument();
    expect(screen.getByText('USDT 잔액')).toBeInTheDocument();
    expect(screen.getByText('네트워크')).toBeInTheDocument();
    expect(screen.getByText('연결 해제')).toBeInTheDocument();
  });

  it('should handle disconnection', async () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    const { shortenAddress } = require('@/utils/format');
    
    const mockAccount = '0x1234567890123456789012345678901234567890';
    shortenAddress.mockReturnValue('0x1234...7890');
    
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: mockAccount,
      balance: '1000000000000000000',
      chainId: 1001,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockGetUSDTBalance.mockResolvedValue('100000000');

    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    render(<WalletButton />);

    // Open details
    const accountButton = screen.getByText('0x1234...7890');
    fireEvent.click(accountButton.parentElement!);

    // Click disconnect
    const disconnectButton = screen.getByText('연결 해제');
    fireEvent.click(disconnectButton);

    expect(window.confirm).toHaveBeenCalledWith('지갑 연결을 해제하시겠습니까?');
    expect(mockDisconnectWallet).toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should switch network if not on Kairos testnet', async () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: '0x1234567890123456789012345678901234567890',
      balance: '1000000000000000000',
      chainId: 8217, // Wrong network
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockGetUSDTBalance.mockResolvedValue('100000000');

    render(<WalletButton />);

    await waitFor(() => {
      expect(mockSwitchNetwork).toHaveBeenCalledWith(1001);
    });
  });

  it('should show connecting state during connection', async () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: null,
      balance: '0',
      chainId: null,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockRequestAccount.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('0x123'), 100)));

    render(<WalletButton />);

    const connectButton = screen.getByText('지갑 연결');
    fireEvent.click(connectButton);

    expect(screen.getByText('연결 중...')).toBeInTheDocument();
  });

  it('should handle connection error', async () => {
    const { useKaiaWalletSdk } = require('@/hooks/useWalletSdk');
    useKaiaWalletSdk.mockReturnValue({
      isInitialized: true,
      account: null,
      balance: '0',
      chainId: null,
      requestAccount: mockRequestAccount,
      disconnectWallet: mockDisconnectWallet,
      getUSDTBalance: mockGetUSDTBalance,
      switchNetwork: mockSwitchNetwork
    });

    mockRequestAccount.mockRejectedValue(new Error('User rejected'));

    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();

    render(<WalletButton />);

    const connectButton = screen.getByText('지갑 연결');
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('지갑 연결에 실패했습니다. 다시 시도해주세요.');
    });

    // Restore original alert
    window.alert = originalAlert;
  });
});