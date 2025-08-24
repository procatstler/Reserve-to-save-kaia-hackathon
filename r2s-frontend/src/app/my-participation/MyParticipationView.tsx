'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLayout from '@/src/components/layout/PageLayout';
import TotalSavingsCard from '@/src/components/participation/TotalSavingsCard';
import OngoingCampaignCard from '@/src/components/participation/OngoingCampaignCard';
import CompletedCampaignCard from '@/src/components/participation/CompletedCampaignCard';
import ExpectedPaymentCard from '@/src/components/participation/ExpectedPaymentCard';
import { getCampaignById } from '@/lib/mockData';
import { Campaign } from '@/src/types';
import { ROUTES } from '@/src/constants';

interface ExtendedCampaign extends Campaign {
  quantity?: string;
  depositAmount?: number;
  currentSavings?: number;
  savedAmount?: number;
  completedDate?: string;
}

export default function MyParticipationView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newParticipationId = searchParams.get('newParticipation');
  const [totalSavings, setTotalSavings] = useState(12.00);
  const [savingsRate] = useState(0.3);
  
  const ongoingCampaigns: ExtendedCampaign[] = [
    {
      id: '1',
      category: '원두',
      categoryIcon: '☕',
      title: '블루마운틴 프리미엄 원두',
      quantity: '1kg × 1개 참여',
      status: 'ongoing',
      discountPercent: 12,
      originalPrice: 100.00,
      discountedPrice: 88.00,
      depositAmount: 100.00,
      currentSavings: 12.00,
      currentParticipants: 38,
      minParticipants: 50,
      timeRemaining: '13:45:22',
      progress: 76
    }
  ];

  const completedCampaigns = [
    {
      id: '2',
      category: '폰',
      categoryIcon: '📱',
      title: '갤럭시 S24 울트라',
      quantity: '256GB × 1개',
      status: 'completed' as const,
      savedAmount: 84,
      completedDate: '2024.08.01'
    },
    {
      id: '3',
      category: '의류',
      categoryIcon: '👗',
      title: '명품 겨울 코트',
      quantity: 'FREE × 1개',
      status: 'completed' as const,
      savedAmount: 48,
      completedDate: '2024.07.15'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSavings(prev => prev + savingsRate / 3600);
    }, 1000);

    return () => clearInterval(interval);
  }, [savingsRate]);

  const handleCampaignClick = (campaignId: string) => {
    const campaign = getCampaignById(campaignId);
    if (campaign?.status === 'completed') {
      router.push(`${ROUTES.settlementComplete}?campaignId=${campaignId}`);
    } else {
      router.push(`${ROUTES.campaignDetail(campaignId)}`);
    }
  };

  return (
    <PageLayout
      header={{
        title: '내 참여 현황',
        subtitle: `현재 ${ongoingCampaigns.length}개 캠페인 참여중`,
        showClose: true,
        variant: 'gradient'
      }}
      showBottomNav
      activeNavItem="my-participation"
      containerBackground="white"
    >
      {/* Total Savings Card - 12.68% from top */}
      <div className="absolute top-[12.68%] left-[5.33%] right-[5.33%] h-[13.67%]">
        <TotalSavingsCard 
          totalSavings={totalSavings}
          savingsRate={savingsRate}
          discountPercentage={12}
        />
      </div>

      {/* Ongoing Campaigns Section - 29.56% from top */}
      <div className="absolute top-[29.56%] left-[5.33%] right-[5.33%] h-[30.54%]">
        <div className="flex justify-between items-center mb-[16px]">
          <h2 className="text-[#212529] text-[18px] font-bold">진행중 캠페인</h2>
          <span className="text-[#6C757D] text-[12px]">{ongoingCampaigns.length}개</span>
        </div>

        <div className="space-y-[12px]">
          {ongoingCampaigns.map((campaign) => (
            <OngoingCampaignCard 
              key={campaign.id}
              campaign={campaign}
              onClick={handleCampaignClick}
            />
          ))}
        </div>
      </div>

      {/* Expected Final Payment - 61.33% from top */}
      <div className="absolute top-[61.33%] left-[5.33%] right-[5.33%] h-[10.71%]">
        <ExpectedPaymentCard 
          currentAmount={88.00}
          targetAmount={85.00}
        />
      </div>

      {/* Completed Campaigns Section - 74.14% from top */}
      <div className="absolute top-[74.14%] left-[5.33%] right-[5.33%] h-[18.47%]">
        <div className="flex justify-between items-center mb-[16px]">
          <h2 className="text-[#212529] text-[18px] font-bold">완료된 캠페인</h2>
          <span className="text-[#6C757D] text-[12px]">{completedCampaigns.length}개</span>
        </div>

        <div className="space-y-[12px]">
          {completedCampaigns.map((campaign) => (
            <CompletedCampaignCard 
              key={campaign.id}
              campaign={campaign}
              onClick={handleCampaignClick}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}