import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Bootstrap } from '../Bootstrap';
import React from 'react';

// Mock hooks
jest.mock('@/hooks/useWalletSdk', () => ({
  useKaiaWalletSecurity: jest.fn()
}));

describe('Bootstrap Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should show loading state initially', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: true,
      isSuccess: false,
      error: null
    });

    render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    expect(screen.getByText('LINE Mini dApp 초기화 중...')).toBeInTheDocument();
    expect(screen.getByText('잠시만 기다려주세요')).toBeInTheDocument();
  });

  it('should render children when initialization succeeds', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: false,
      isSuccess: true,
      error: null
    });

    render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    expect(screen.getByText('App Content')).toBeInTheDocument();
  });

  it('should show error state when initialization fails', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      error: new Error('Initialization failed')
    });

    render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    expect(screen.getByText('초기화 실패')).toBeInTheDocument();
    expect(screen.getByText('앱을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
  });

  it('should handle retry button click', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      error: new Error('Initialization failed')
    });

    // Mock window.location.reload
    const originalReload = window.location.reload;
    window.location.reload = jest.fn();

    render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    const retryButton = screen.getByText('다시 시도');
    retryButton.click();

    expect(window.location.reload).toHaveBeenCalled();

    // Restore original reload
    window.location.reload = originalReload;
  });

  it('should apply custom className', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: false,
      isSuccess: true,
      error: null
    });

    const { container } = render(
      <Bootstrap className="custom-class">
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    const bootstrapDiv = container.querySelector('.custom-class');
    expect(bootstrapDiv).toBeInTheDocument();
  });

  it('should show retry count', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      error: new Error('Initialization failed')
    });

    render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    expect(screen.getByText('재시도 횟수: 0/3')).toBeInTheDocument();
  });

  it('should show loading animation', () => {
    const { useKaiaWalletSecurity } = require('@/hooks/useWalletSdk');
    useKaiaWalletSecurity.mockReturnValue({
      isLoading: true,
      isSuccess: false,
      error: null
    });

    const { container } = render(
      <Bootstrap>
        <div>App Content</div>
      </Bootstrap>,
      { wrapper }
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});