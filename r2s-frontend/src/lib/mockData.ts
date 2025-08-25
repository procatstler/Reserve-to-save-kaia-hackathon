import { Campaign } from '@/types';
import { CampaignStatus } from '@/types/campaign';

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: '블루마운틴 프리미엄 원두',
    description: '1kg × 최소 50개',
    category: '원두',
    categoryIcon: '☕',
    categoryColor: 'bg-gradient-to-br from-brown-500 to-brown-600',
    originalPrice: 100,
    discountedPrice: 88,
    discountPercent: 12,
    badge: 'HOT',
    progress: 74,
    currentParticipants: 37,
    minParticipants: 50,
    timeRemaining: '14:32:05',
    status: 'active' as const,
    discountRate: 12,
    targetDiscount: 12,
    quantity: '1kg × 최소 50개'
  },
  {
    id: '2',
    title: '갤럭시 S24 울트라',
    description: '256GB × 최소 20개',
    category: '스마트폰',
    categoryIcon: '📱',
    categoryColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    originalPrice: 1200,
    discountedPrice: 1116,
    discountPercent: 7,
    badge: null,
    progress: 60,
    currentParticipants: 12,
    minParticipants: 20,
    timeRemaining: '2일 3시간 남음',
    status: 'active' as const,
    discountRate: 7,
    targetDiscount: 7,
    quantity: '256GB × 최소 20개'
  },
  {
    id: '3',
    title: '명품 겨울 코트',
    description: 'FREE × 최소 30개',
    category: '의류',
    categoryIcon: '👕',
    categoryColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
    originalPrice: 800,
    discountedPrice: 768,
    discountPercent: 4,
    badge: null,
    progress: 30,
    currentParticipants: 9,
    minParticipants: 30,
    timeRemaining: '3일 3시간 남음',
    status: 'active' as const,
    discountRate: 4,
    targetDiscount: 4,
    quantity: 'FREE × 최소 30개'
  },
  {
    id: '4',
    title: 'AirPods Pro 2세대',
    description: '노이즈 캔슬링의 정점',
    category: '음향기기',
    categoryIcon: '🎧',
    categoryColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
    originalPrice: 350,
    discountedPrice: 280,
    discountPercent: 20,
    badge: '완료',
    progress: 100,
    currentParticipants: 100,
    minParticipants: 100,
    timeRemaining: null,
    status: 'completed' as const,
    discountRate: 20,
    targetDiscount: 20,
    quantity: '1개 × 최소 100개'
  },
  {
    id: '5',
    title: '닌텐도 스위치 OLED',
    description: '더 선명한 OLED 화면',
    category: '게임',
    categoryIcon: '🎮',
    categoryColor: 'bg-gradient-to-br from-red-500 to-red-600',
    originalPrice: 400,
    discountedPrice: 320,
    discountPercent: 20,
    badge: null,
    progress: 60,
    currentParticipants: 60,
    minParticipants: 100,
    timeRemaining: '1일 12시간 남음',
    status: 'active' as const,
    discountRate: 20,
    targetDiscount: 20,
    quantity: '1개 × 최소 100개'
  }
];

export function getCampaignById(id: string): Campaign | null {
  return mockCampaigns.find(campaign => campaign.id === id) || null;
}

export function getCampaigns(options?: {
  status?: 'active' | 'completed';
  limit?: number;
}): Campaign[] {
  let campaigns = [...mockCampaigns];
  
  if (options?.status) {
    campaigns = campaigns.filter(c => c.status === options.status);
  }
  
  if (options?.limit) {
    campaigns = campaigns.slice(0, options.limit);
  }
  
  return campaigns;
}