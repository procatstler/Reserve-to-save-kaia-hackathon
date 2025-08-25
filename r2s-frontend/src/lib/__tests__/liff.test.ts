import { initializeLiff, getLiffProfile, isInLiff, shareCampaign } from '../liff';

// Mock @line/liff module
jest.mock('@line/liff', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    isLoggedIn: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
    isInClient: jest.fn(),
    getVersion: jest.fn(),
    isApiAvailable: jest.fn(),
    shareTargetPicker: jest.fn(),
  }
}));

describe('LIFF Utils', () => {
  const mockLiffId = 'test-liff-id';
  const mockProfile = {
    userId: 'user123',
    displayName: 'Test User',
    pictureUrl: 'https://example.com/picture.jpg',
    statusMessage: 'Test status'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_LIFF_ID = mockLiffId;
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  });

  describe('initializeLiff', () => {
    it('should initialize LIFF successfully when user is logged in', async () => {
      const liff = require('@line/liff').default;
      liff.init.mockResolvedValue(undefined);
      liff.isLoggedIn.mockReturnValue(true);

      const result = await initializeLiff();

      expect(liff.init).toHaveBeenCalledWith({ liffId: mockLiffId });
      expect(liff.isLoggedIn).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should trigger login when user is not logged in', async () => {
      const liff = require('@line/liff').default;
      liff.init.mockResolvedValue(undefined);
      liff.isLoggedIn.mockReturnValue(false);

      const result = await initializeLiff();

      expect(liff.login).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when LIFF ID is not set', async () => {
      delete process.env.NEXT_PUBLIC_LIFF_ID;

      const result = await initializeLiff();

      expect(result).toBe(false);
    });

    it('should handle initialization errors', async () => {
      const liff = require('@line/liff').default;
      liff.init.mockRejectedValue(new Error('Init failed'));

      const result = await initializeLiff();

      expect(result).toBe(false);
    });
  });

  describe('getLiffProfile', () => {
    it('should return user profile when logged in', async () => {
      const liff = require('@line/liff').default;
      liff.isLoggedIn.mockReturnValue(true);
      liff.getProfile.mockResolvedValue(mockProfile);

      const profile = await getLiffProfile();

      expect(profile).toEqual({
        userId: mockProfile.userId,
        displayName: mockProfile.displayName,
        pictureUrl: mockProfile.pictureUrl,
        statusMessage: mockProfile.statusMessage
      });
    });

    it('should return null when not logged in', async () => {
      const liff = require('@line/liff').default;
      liff.isLoggedIn.mockReturnValue(false);

      const profile = await getLiffProfile();

      expect(profile).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const liff = require('@line/liff').default;
      liff.isLoggedIn.mockReturnValue(true);
      liff.getProfile.mockRejectedValue(new Error('Failed to get profile'));

      const profile = await getLiffProfile();

      expect(profile).toBeNull();
    });
  });

  describe('isInLiff', () => {
    it('should return true when in LIFF client', () => {
      const liff = require('@line/liff').default;
      liff.isInClient.mockReturnValue(true);

      const result = isInLiff();

      expect(result).toBe(true);
    });

    it('should return false when not in LIFF client', () => {
      const liff = require('@line/liff').default;
      liff.isInClient.mockReturnValue(false);

      const result = isInLiff();

      expect(result).toBe(false);
    });
  });

  describe('shareCampaign', () => {
    const campaignId = 'campaign123';
    const title = 'Test Campaign';

    it('should share campaign successfully', async () => {
      const liff = require('@line/liff').default;
      liff.isApiAvailable.mockReturnValue(true);
      liff.shareTargetPicker.mockResolvedValue(undefined);

      await shareCampaign(campaignId, title);

      expect(liff.shareTargetPicker).toHaveBeenCalled();
      const shareCall = liff.shareTargetPicker.mock.calls[0][0];
      expect(shareCall[0].type).toBe('flex');
      expect(shareCall[0].altText).toContain(title);
    });

    it('should throw error when share API is not available', async () => {
      const liff = require('@line/liff').default;
      liff.isApiAvailable.mockReturnValue(false);

      await expect(shareCampaign(campaignId, title)).rejects.toThrow('공유 기능을 사용할 수 없습니다');
    });

    it('should handle share errors', async () => {
      const liff = require('@line/liff').default;
      liff.isApiAvailable.mockReturnValue(true);
      liff.shareTargetPicker.mockRejectedValue(new Error('Share failed'));

      await expect(shareCampaign(campaignId, title)).rejects.toThrow('Share failed');
    });
  });
});