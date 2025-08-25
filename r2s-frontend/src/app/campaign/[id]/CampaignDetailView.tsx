'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import R2SHeader from '@/components/common/R2SHeader';
import CampaignDetailHeader from '@/components/campaign/CampaignDetailHeader';
import DiscountSection from '@/components/campaign/DiscountSection';
import PriceSection from '@/components/campaign/PriceSection';
import ParticipationStatus from '@/components/campaign/ParticipationStatus';
import { Button } from '@/components/ui/Button';
import { Campaign } from '@/types';
import { ROUTES } from '@/constants';
import { getCampaignById } from '@/lib/mockData';
import { formatTimeRemaining } from '@/lib/utils';

export default function CampaignDetailView() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState('14:32:05');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const campaignData = getCampaignById(campaignId);
    if (campaignData) {
      setCampaign(campaignData);
      setTimeLeft(campaignData.timeRemaining || '14:32:05');
    }
    setLoading(false);
  }, [campaignId]);

  useEffect(() => {
    if (!campaign) return;

    const timer = setInterval(() => {
      const [hours, minutes, seconds] = timeLeft.split(':').map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      if (totalSeconds > 0) {
        totalSeconds--;
        setTimeLeft(formatTimeRemaining(totalSeconds));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, campaign]);

  const handleParticipate = () => {
    router.push(`${ROUTES.paymentConfirmation}?campaignId=${campaignId}`);
  };

  if (loading) {
    return (
      <PageLayout
        header={{
          title: '캠페인 상세',
          showBack: true,
          showClose: true,
          variant: 'gradient'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-[#6C757D]">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!campaign) {
    return (
      <PageLayout
        header={{
          title: '캠페인 상세',
          showBack: true,
          showClose: true,
          variant: 'gradient'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-[#6C757D]">캠페인을 찾을 수 없습니다.</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout containerBackground="white">
      <div className="flex flex-col min-h-screen">
        {/* 공통 R2S 헤더 */}
        <R2SHeader showBack showClose />
        
        {/* Alert Banner */}
        <div className="px-[20px] pt-[6px] pb-[16px]">
          <CampaignDetailHeader campaign={campaign} />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-[20px] space-y-[16px] pb-[120px]">
          {/* Product Card */}
          <div className="bg-[#8B4513] rounded-[20px] flex flex-col items-center justify-center relative py-[40px] px-[20px]">
            {campaign.badge && (
              <div className="absolute top-[10px] right-[10px]">
                <span className="bg-[#DC3545] text-white text-[11px] font-bold px-[8px] py-[2px] rounded-full">
                  {campaign.badge}
                </span>
              </div>
            )}
            <span className="text-[36px] mb-[12px]">{campaign.categoryIcon}</span>
            <h2 className="text-white text-[16px] font-medium">{campaign.title}</h2>
          </div>

          {/* Discount Section */}
          <div className="py-[8px]">
            <DiscountSection campaign={campaign} />
          </div>

          {/* Price Section */}
          <div className="py-[8px]">
            <PriceSection campaign={campaign} />
          </div>

          {/* Participation Status */}
          <div className="py-[8px]">
            <ParticipationStatus campaign={campaign} />
          </div>

          {/* Time Remaining */}
          <div className="bg-[#FFF3CD] rounded-[16px] px-[20px] py-[16px]">
            <div className="flex justify-between items-center mb-[4px]">
              <span className="text-[#856404] text-[14px] font-bold">
                ⏰ 마감까지 남은 시간
              </span>
              <span className="text-[#856404] text-[18px] font-bold">
                {timeLeft}
              </span>
            </div>
            <span className="text-[#856404] text-[12px]">
              시간이 지날수록 할인율이 더 높아집니다!
            </span>
          </div>
        </main>

        {/* Fixed Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-[20px] py-[16px] space-y-[12px]">
          {/* CTA Button */}
          <Button
            fullWidth
            size="xl"
            className="h-[48px]"
            onClick={handleParticipate}
          >
            {campaign.discountedPrice} USDT로 참여하기
          </Button>
          
          {/* Footer Text */}
          <div className="text-center">
            <span className="text-[#6C757D] text-[11px]">
              • 예치금은 100% 안전하게 보관됩니다 •
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}