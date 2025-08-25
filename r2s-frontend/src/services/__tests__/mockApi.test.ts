import { mockApiService } from '../mockApi';
import { CampaignStatus } from '@/types/campaign';
import { ParticipationStatus } from '@/types/participation';
import { PaymentStatus } from '@/types/payment';

describe('Mock API Service', () => {
  describe('getCampaigns', () => {
    it('should return list of campaigns', async () => {
      const campaigns = await mockApiService.getCampaigns();
      
      expect(Array.isArray(campaigns)).toBe(true);
      expect(campaigns.length).toBeGreaterThan(0);
      
      const campaign = campaigns[0];
      expect(campaign).toHaveProperty('id');
      expect(campaign).toHaveProperty('title');
      expect(campaign).toHaveProperty('status');
      expect(campaign).toHaveProperty('basePrice');
    });

    it('should filter campaigns by status', async () => {
      const recruitingCampaigns = await mockApiService.getCampaigns({ status: CampaignStatus.RECRUITING });
      
      recruitingCampaigns.forEach(campaign => {
        expect(campaign.status).toBe(CampaignStatus.RECRUITING);
      });
    });

    it('should sort campaigns', async () => {
      const campaigns = await mockApiService.getCampaigns({ sort: 'popular' });
      
      // Check that campaigns are sorted by participants (descending)
      for (let i = 1; i < campaigns.length; i++) {
        expect(campaigns[i - 1].participants).toBeGreaterThanOrEqual(campaigns[i].participants);
      }
    });

    it('should limit number of campaigns', async () => {
      const campaigns = await mockApiService.getCampaigns({ limit: 3 });
      
      expect(campaigns.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getCampaignById', () => {
    it('should return a specific campaign', async () => {
      const campaign = await mockApiService.getCampaignById('1');
      
      expect(campaign).toBeDefined();
      expect(campaign?.id).toBe('1');
    });

    it('should return null for non-existent campaign', async () => {
      const campaign = await mockApiService.getCampaignById('999');
      
      expect(campaign).toBeNull();
    });
  });

  describe('getUserParticipations', () => {
    it('should return user participations', async () => {
      const participations = await mockApiService.getUserParticipations('user123');
      
      expect(Array.isArray(participations)).toBe(true);
      
      if (participations.length > 0) {
        const participation = participations[0];
        expect(participation).toHaveProperty('id');
        expect(participation).toHaveProperty('userId');
        expect(participation).toHaveProperty('campaignId');
        expect(participation).toHaveProperty('status');
        expect(participation.userId).toBe('user123');
      }
    });

    it('should filter participations by status', async () => {
      const activeParticipations = await mockApiService.getUserParticipations(
        'user123',
        ParticipationStatus.ACTIVE
      );
      
      activeParticipations.forEach(participation => {
        expect(participation.status).toBe(ParticipationStatus.ACTIVE);
      });
    });
  });

  describe('joinCampaign', () => {
    it('should create a new participation', async () => {
      const params = {
        campaignId: '1',
        userId: 'user123',
        walletAddress: '0x1234567890123456789012345678901234567890',
        amount: '10000000' // 10 USDT
      };
      
      const participation = await mockApiService.joinCampaign(params);
      
      expect(participation.campaignId).toBe(params.campaignId);
      expect(participation.userId).toBe(params.userId);
      expect(participation.walletAddress).toBe(params.walletAddress);
      expect(participation.depositAmount).toBe(params.amount);
      expect(participation.status).toBe(ParticipationStatus.ACTIVE);
    });
  });

  describe('cancelParticipation', () => {
    it('should cancel an existing participation', async () => {
      const result = await mockApiService.cancelParticipation('part1', 'user123');
      
      expect(result).toBe(true);
    });

    it('should return false for non-existent participation', async () => {
      const result = await mockApiService.cancelParticipation('invalid', 'user123');
      
      expect(result).toBe(false);
    });
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const params = {
        campaignId: '1',
        userId: 'user123',
        walletAddress: '0x1234567890123456789012345678901234567890',
        amount: '10000000',
        currency: 'USDT' as const,
        mode: 'crypto' as const
      };
      
      const payment = await mockApiService.createPayment(params);
      
      expect(payment).toHaveProperty('paymentId');
      expect(payment).toHaveProperty('paymentUrl');
      expect(payment.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      const status = await mockApiService.getPaymentStatus('payment123');
      
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('transactionHash');
    });
  });

  describe('finalizePayment', () => {
    it('should finalize a payment', async () => {
      const result = await mockApiService.finalizePayment('payment123', '0xtxhash');
      
      expect(result).toBe(true);
    });
  });
});