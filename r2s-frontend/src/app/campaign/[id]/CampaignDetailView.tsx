'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageLayout from '@/src/components/layout/PageLayout';
import CampaignDetailHeader from '@/src/components/campaign/CampaignDetailHeader';
import DiscountSection from '@/src/components/campaign/DiscountSection';
import PriceSection from '@/src/components/campaign/PriceSection';
import ParticipationStatus from '@/src/components/campaign/ParticipationStatus';
import Button from '@/src/components/ui/Button';
import { Campaign } from '@/src/types';
import { ROUTES } from '@/src/constants';
import { getCampaignById } from '@/lib/mockData';
import { formatTimeRemaining } from '@/src/lib/utils';

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
    <PageLayout
      header={{
        title: '캠페인 상세',
        showBack: true,
        showClose: true,
        variant: 'gradient'
      }}
      containerBackground="white"
    >
      {/* Alert Banner */}
      <div className="absolute top-[6.16%] left-[20px] right-[20px] h-[3.33%]">
        <CampaignDetailHeader campaign={campaign} />
      </div>

      {/* Product Card */}
      <div className="absolute top-[12.19%] left-[20px] right-[20px] h-[22.54%]">
        <div className="h-full bg-[#8B4513] rounded-[20px] flex flex-col items-center justify-center relative">
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
      </div>

      {/* Discount Section */}
      <div className="absolute top-[37.07%] left-[20px] right-[20px] h-[13.55%]">
        <DiscountSection campaign={campaign} />
      </div>

      {/* Price Section */}
      <div className="absolute top-[52.96%] left-[20px] right-[20px] h-[11.08%]">
        <PriceSection campaign={campaign} />
      </div>

      {/* Participation Status */}
      <div className="absolute top-[66.26%] left-[20px] right-[20px] h-[11.08%]">
        <ParticipationStatus campaign={campaign} />
      </div>

      {/* Time Remaining */}
      <div className="absolute top-[79.56%] left-[20px] right-[20px] h-[6.77%]">
        <div className="bg-[#FFF3CD] rounded-[16px] px-[20px] py-[10px] h-full">
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
      </div>

      {/* CTA Button */}
      <div className="absolute top-[88.42%] left-[20px] right-[20px] h-[5.91%]">
        <Button
          fullWidth
          size="xl"
          className="h-full"
          onClick={handleParticipate}
        >
          {campaign.discountedPrice} USDT로 참여하기
        </Button>
      </div>

      {/* Footer Text - 95.81% from top */}
      <div className="absolute top-[95.81%] left-0 right-0 text-center">
        <span className="text-[#6C757D] text-[11px]">
          • 예치금은 100% 안전하게 보관됩니다 •
        </span>
      </div>
    </PageLayout>
  );
}