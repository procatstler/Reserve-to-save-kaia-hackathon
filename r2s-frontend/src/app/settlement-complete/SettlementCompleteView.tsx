'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLayout from '@/src/components/layout/PageLayout';
import Button from '@/src/components/ui/Button';
import SuccessAnimation from '@/src/components/settlement/SuccessAnimation';
import FinalDiscountCard from '@/src/components/settlement/FinalDiscountCard';
import PaymentDetailsCard from '@/src/components/settlement/PaymentDetailsCard';
import CampaignSummaryCard from '@/src/components/settlement/CampaignSummaryCard';
import ProductDeliveryInfo from '@/src/components/settlement/ProductDeliveryInfo';
import { getCampaignById } from '@/lib/mockData';
import { Campaign } from '@/src/types';
import { ROUTES } from '@/src/constants';

export default function SettlementCompleteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || '4';
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const campaignData = getCampaignById(campaignId);
    if (campaignData) {
      setCampaign(campaignData);
    }
  }, [campaignId]);

  if (!campaign) {
    return (
      <PageLayout
        header={{
          title: '정산 완료',
          subtitle: '🎉 캠페인이 성공적으로 완료되었습니다!',
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

  const settlementData = {
    product: {
      category: campaign.category,
      categoryIcon: campaign.categoryIcon,
      categoryColor: campaign.categoryColor,
      title: campaign.title,
      quantity: campaign.quantity || '1kg × 1개 • 배송 준비중',
      deliveryStatus: '배송중',
      expectedDelivery: '2024.08.19 (월)'
    },
    discount: {
      finalDiscount: campaign.targetDiscount || 15,
      finalDiscountAmount: (campaign.originalPrice * (campaign.targetDiscount || 15)) / 100,
      achievedRate: campaign.targetDiscount || 15
    },
    payment: {
      depositAmount: campaign.originalPrice,
      discountAmount: (campaign.originalPrice * (campaign.targetDiscount || 15)) / 100,
      finalAmount: campaign.originalPrice - ((campaign.originalPrice * (campaign.targetDiscount || 15)) / 100),
      transactionId: '0xabcd...1234',
      completedAt: campaign.completedAt || '2024.08.16 14:32'
    },
    campaign: {
      totalParticipants: campaign.minParticipants,
      waitingTime: '72시간',
      successRate: 100
    }
  };

  const handleViewReceipt = () => {
    console.log('View receipt');
  };

  const handleShare = () => {
    console.log('Share with friends');
  };

  const handleViewNewCampaigns = () => {
    router.push(ROUTES.campaigns);
  };

  return (
    <PageLayout
      header={{
        title: '정산 완료',
        subtitle: '🎉 캠페인이 성공적으로 완료되었습니다!',
        showClose: true,
        variant: 'gradient'
      }}
      containerBackground="white"
    >
      {/* Success Animation - 12.93% from top */}
      <div className="absolute top-[12.93%] left-0 right-0 h-[9.85%]">
        <SuccessAnimation />
      </div>

      {/* Final Discount Card - 24.88% from top */}
      <div className="absolute top-[24.88%] left-[5.33%] right-[5.33%] h-[14.16%]">
        <FinalDiscountCard 
          finalDiscountAmount={settlementData.discount.finalDiscountAmount}
          finalDiscount={settlementData.discount.finalDiscount}
          achievedRate={settlementData.discount.achievedRate}
          totalParticipants={settlementData.campaign.totalParticipants}
        />
      </div>

      {/* Payment Details - 40.64% from top */}
      <div className="absolute top-[40.64%] left-[5.33%] right-[5.33%] h-[19.21%]">
        <PaymentDetailsCard 
          depositAmount={settlementData.payment.depositAmount}
          discountAmount={settlementData.payment.discountAmount}
          finalAmount={settlementData.payment.finalAmount}
          transactionId={settlementData.payment.transactionId}
          completedAt={settlementData.payment.completedAt}
        />
      </div>

      {/* Campaign Summary - 60.34% from top */}
      <div className="absolute top-[60.34%] left-[5.33%] right-[5.33%] h-[10.96%]">
        <CampaignSummaryCard 
          totalParticipants={settlementData.campaign.totalParticipants}
          waitingTime={settlementData.campaign.waitingTime}
          successRate={settlementData.campaign.successRate}
        />
      </div>

      {/* Product Delivery Info - 73.89% from top */}
      <div className="absolute top-[73.89%] left-[5.33%] right-[5.33%] h-[8.62%]">
        <ProductDeliveryInfo product={settlementData.product} />
      </div>

      {/* Action Buttons - 85.59% from top */}
      <div className="absolute top-[85.59%] left-[5.33%] right-[5.33%] h-[5.91%] flex gap-[12px]">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleViewReceipt}
          className="flex-1 h-full"
        >
          📋 영수증 보기
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleShare}
          className="flex-1 h-full"
        >
          📤 친구에게 공유
        </Button>
      </div>

      {/* Footer Link - 94.21% from top */}
      <div className="absolute top-[94.21%] left-0 right-0 text-center">
        <button 
          onClick={handleViewNewCampaigns}
          className="text-[#388EDA] text-[12px] hover:underline"
        >
          🔥 새로운 캠페인을 확인해보세요!
        </button>
      </div>
    </PageLayout>
  );
}