import { Campaign, UserParticipation } from '@/src/types';

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    category: '원두',
    categoryIcon: '☕',
    categoryColor: 'bg-[#8B4513]',
    badge: 'HOT',
    title: '블루마운틴 프리미엄 원두',
    description: '1kg × 최소 50개',
    quantity: '1kg × 1개',
    originalPrice: 100,
    discountedPrice: 88,
    discountPercent: 12,
    currentParticipants: 37,
    minParticipants: 50,
    timeRemaining: '14:32:05',
    progress: 74,
    status: 'ongoing',
    discountRate: 0.3,
    targetDiscount: 15,
    participantAlert: '👤 김OO님이 방금 참여했어요!'
  },
  {
    id: '2',
    category: '스마트폰',
    categoryIcon: '📱',
    categoryColor: 'bg-[#4169E1]',
    badge: null,
    title: '갤럭시 S24 울트라',
    description: '256GB × 최소 20개',
    quantity: '256GB × 1개',
    originalPrice: 1200,
    discountedPrice: 1116,
    discountPercent: 7,
    currentParticipants: 12,
    minParticipants: 20,
    daysRemaining: '2일 3시간 남음',
    progress: 60,
    status: 'ongoing',
    discountRate: 0.2,
    targetDiscount: 10
  },
  {
    id: '3',
    category: '의류',
    categoryIcon: '👗',
    categoryColor: 'bg-[#FF1493]',
    badge: null,
    title: '명품 겨울 코트',
    description: 'FREE × 최소 30개',
    quantity: 'FREE × 1개',
    originalPrice: 800,
    discountedPrice: 768,
    discountPercent: 4,
    currentParticipants: 8,
    minParticipants: 30,
    daysRemaining: '3일 3시간 남음',
    progress: 27,
    status: 'ongoing',
    discountRate: 0.1,
    targetDiscount: 8
  },
  {
    id: '4',
    category: '전자제품',
    categoryIcon: '💻',
    categoryColor: 'bg-[#6C757D]',
    badge: null,
    title: '맥북 프로 14인치',
    description: 'M3 Pro × 최소 10개',
    quantity: 'M3 Pro × 1개',
    originalPrice: 2500,
    discountedPrice: 2125,
    discountPercent: 15,
    currentParticipants: 10,
    minParticipants: 10,
    timeRemaining: '00:00:00',
    progress: 100,
    status: 'completed',
    discountRate: 0,
    targetDiscount: 15,
    completedAt: '2024.08.16 14:32'
  }
];

export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id);
};

export const getOngoingCampaigns = (): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.status === 'ongoing');
};

export const getCompletedCampaigns = (): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.status === 'completed');
};

export const mockUserParticipations: UserParticipation[] = [
  {
    campaignId: '1',
    depositAmount: 100,
    participatedAt: '2024.08.14 10:00',
    currentSavings: 12,
    expectedFinalPrice: 88
  }
];

export const getUserParticipation = (campaignId: string): UserParticipation | undefined => {
  return mockUserParticipations.find(p => p.campaignId === campaignId);
};