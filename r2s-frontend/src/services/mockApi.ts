import { Campaign, CampaignStatus } from '@/types/campaign';
import { Participation, ParticipationStatus } from '@/types/participation';
import { Payment, PaymentStatus } from '@/types/payment';

// Mock 데이터
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    address: '0x1234567890123456789012345678901234567890',
    title: '최신 갤럭시 스마트폰 공동구매',
    description: '최신 갤럭시 S24 Ultra를 특별 할인가로 만나보세요! 공동구매 참여시 최대 20% 할인 혜택을 받을 수 있습니다.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    merchant: 'Samsung Store',
    basePrice: '1200000000', // 1200 USDT in 6 decimals
    minQty: 100,
    currentQty: 75,
    targetAmount: '120000000000', // 120,000 USDT
    currentAmount: '90000000000', // 90,000 USDT
    discountRate: 1500, // 15%
    saveFloorBps: 500, // 5% minimum
    rMaxBps: 2000, // 20% maximum
    startTime: new Date('2024-01-01'),
    endTime: new Date('2024-02-01'),
    settlementDate: new Date('2024-02-15'),
    status: CampaignStatus.RECRUITING,
    participants: 75,
    progress: 75
  },
  {
    id: '2',
    address: '0x2345678901234567890123456789012345678901',
    title: 'LG OLED TV 55인치 공동구매',
    description: '프리미엄 LG OLED TV를 합리적인 가격에! 생생한 화질과 완벽한 블랙을 경험하세요.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    merchant: 'LG Electronics',
    basePrice: '1800000000', // 1800 USDT
    minQty: 50,
    currentQty: 52,
    targetAmount: '90000000000',
    currentAmount: '93600000000',
    discountRate: 1800,
    saveFloorBps: 600,
    rMaxBps: 2200,
    startTime: new Date('2024-01-05'),
    endTime: new Date('2024-01-25'),
    settlementDate: new Date('2024-02-10'),
    status: CampaignStatus.REACHED,
    participants: 52,
    progress: 104
  },
  {
    id: '3',
    address: '0x3456789012345678901234567890123456789012',
    title: '다이슨 무선청소기 V15 공동구매',
    description: '강력한 흡입력의 다이슨 V15를 특별가로! 레이저 먼지 감지 기능으로 더욱 깨끗하게.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    merchant: 'Dyson Korea',
    basePrice: '650000000', // 650 USDT
    minQty: 150,
    currentQty: 45,
    targetAmount: '97500000000',
    currentAmount: '29250000000',
    discountRate: 1200,
    saveFloorBps: 400,
    rMaxBps: 1800,
    startTime: new Date('2024-01-10'),
    endTime: new Date('2024-02-20'),
    settlementDate: new Date('2024-03-05'),
    status: CampaignStatus.RECRUITING,
    participants: 45,
    progress: 30
  },
  {
    id: '4',
    address: '0x4567890123456789012345678901234567890123',
    title: 'Apple AirPods Pro 2세대 공동구매',
    description: '노이즈 캔슬링의 정점! AirPods Pro 2세대를 합리적인 가격에 만나보세요.',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    merchant: 'Apple Store',
    basePrice: '280000000', // 280 USDT
    minQty: 200,
    currentQty: 180,
    targetAmount: '56000000000',
    currentAmount: '50400000000',
    discountRate: 1000,
    saveFloorBps: 300,
    rMaxBps: 1500,
    startTime: new Date('2024-01-03'),
    endTime: new Date('2024-01-20'),
    settlementDate: new Date('2024-02-01'),
    status: CampaignStatus.RECRUITING,
    participants: 180,
    progress: 90
  },
  {
    id: '5',
    address: '0x5678901234567890123456789012345678901234',
    title: '닌텐도 스위치 OLED 모델 공동구매',
    description: '더 선명한 OLED 화면! 닌텐도 스위치 OLED 모델을 특별 할인가로.',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    merchant: 'Nintendo Store',
    basePrice: '350000000', // 350 USDT
    minQty: 100,
    currentQty: 100,
    targetAmount: '35000000000',
    currentAmount: '35000000000',
    discountRate: 800,
    saveFloorBps: 250,
    rMaxBps: 1200,
    startTime: new Date('2023-12-20'),
    endTime: new Date('2024-01-10'),
    settlementDate: new Date('2024-01-25'),
    status: CampaignStatus.SETTLED,
    participants: 100,
    progress: 100
  }
];

const mockParticipations: Participation[] = [
  {
    id: 'part1',
    campaignId: '1',
    campaignTitle: '최신 갤럭시 스마트폰 공동구매',
    userId: 'user123',
    walletAddress: '0xuser123wallet',
    depositAmount: '1200000000',
    joinedAt: new Date('2024-01-15'),
    status: ParticipationStatus.ACTIVE,
    expectedRebate: '60000000' // 60 USDT
  },
  {
    id: 'part2',
    campaignId: '5',
    campaignTitle: '닌텐도 스위치 OLED 모델 공동구매',
    userId: 'user123',
    walletAddress: '0xuser123wallet',
    depositAmount: '350000000',
    joinedAt: new Date('2023-12-25'),
    status: ParticipationStatus.SETTLED,
    expectedRebate: '17500000',
    actualRebate: '17500000',
    settlementTxHash: '0xsettlement123'
  }
];

// Delay 함수 (API 호출 시뮬레이션)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export const mockApiService = {
  // 캠페인 목록 조회
  async getCampaigns(params?: {
    status?: CampaignStatus;
    sort?: 'latest' | 'popular' | 'ending';
    limit?: number;
  }): Promise<Campaign[]> {
    await delay(300);
    
    let campaigns = [...mockCampaigns];
    
    // 상태 필터링
    if (params?.status) {
      campaigns = campaigns.filter(c => c.status === params.status);
    }
    
    // 정렬
    if (params?.sort) {
      switch (params.sort) {
        case 'latest':
          campaigns.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
          break;
        case 'popular':
          campaigns.sort((a, b) => b.participants - a.participants);
          break;
        case 'ending':
          campaigns.sort((a, b) => a.endTime.getTime() - b.endTime.getTime());
          break;
      }
    }
    
    // 제한
    if (params?.limit) {
      campaigns = campaigns.slice(0, params.limit);
    }
    
    return campaigns;
  },

  // 캠페인 상세 조회
  async getCampaignById(id: string): Promise<Campaign | null> {
    await delay(200);
    return mockCampaigns.find(c => c.id === id) || null;
  },

  // 사용자 참여 내역 조회
  async getUserParticipations(
    userId: string,
    status?: ParticipationStatus
  ): Promise<Participation[]> {
    await delay(200);
    
    let participations = mockParticipations.filter(p => p.userId === userId);
    
    if (status) {
      participations = participations.filter(p => p.status === status);
    }
    
    return participations;
  },

  // 캠페인 참여
  async joinCampaign(params: {
    campaignId: string;
    userId: string;
    walletAddress: string;
    amount: string;
  }): Promise<Participation> {
    await delay(500);
    
    const campaign = mockCampaigns.find(c => c.id === params.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    const participation: Participation = {
      id: `part${Date.now()}`,
      campaignId: params.campaignId,
      campaignTitle: campaign.title,
      userId: params.userId,
      walletAddress: params.walletAddress,
      depositAmount: params.amount,
      joinedAt: new Date(),
      status: ParticipationStatus.ACTIVE,
      expectedRebate: String(Number(params.amount) * campaign.saveFloorBps / 10000)
    };
    
    mockParticipations.push(participation);
    
    // Update campaign stats
    campaign.currentQty++;
    campaign.currentAmount = String(Number(campaign.currentAmount) + Number(params.amount));
    campaign.participants++;
    campaign.progress = calculateProgress(campaign.currentQty, campaign.minQty);
    
    return participation;
  },

  // 참여 취소
  async cancelParticipation(participationId: string, userId: string): Promise<boolean> {
    await delay(500);
    
    const participation = mockParticipations.find(
      p => p.id === participationId && p.userId === userId
    );
    
    if (!participation) {
      return false;
    }
    
    participation.status = ParticipationStatus.CANCELLED;
    participation.refundedAmount = participation.depositAmount;
    
    return true;
  },

  // 결제 생성
  async createPayment(params: {
    campaignId: string;
    userId: string;
    walletAddress: string;
    amount: string;
    currency: 'USDT' | 'KAIA';
    mode: 'crypto' | 'stripe';
  }): Promise<{
    paymentId: string;
    paymentUrl: string;
    expiresAt: string;
    status: PaymentStatus;
  }> {
    await delay(500);
    
    return {
      paymentId: `payment${Date.now()}`,
      paymentUrl: `https://payment.example.com/pay/${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      status: PaymentStatus.PENDING
    };
  },

  // 결제 상태 조회
  async getPaymentStatus(paymentId: string): Promise<{
    status: PaymentStatus;
    transactionHash?: string;
  }> {
    await delay(200);
    
    // Simulate different statuses
    const random = Math.random();
    if (random < 0.7) {
      return {
        status: PaymentStatus.COMPLETED,
        transactionHash: `0x${Date.now().toString(16)}`
      };
    } else if (random < 0.9) {
      return {
        status: PaymentStatus.PROCESSING
      };
    } else {
      return {
        status: PaymentStatus.FAILED
      };
    }
  },

  // 결제 완료 처리
  async finalizePayment(paymentId: string, transactionHash: string): Promise<boolean> {
    await delay(500);
    
    // In real implementation, this would update the payment record
    console.log(`Payment ${paymentId} finalized with tx: ${transactionHash}`);
    
    return true;
  },

  // 지갑 잔액 조회
  async getWalletBalance(address: string): Promise<{
    kaia: string;
    usdt: string;
  }> {
    await delay(200);
    
    return {
      kaia: '1000000000000000000', // 1 KAIA
      usdt: '100000000' // 100 USDT
    };
  }
};

// Helper function
function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(100, Math.max(0, progress));
}