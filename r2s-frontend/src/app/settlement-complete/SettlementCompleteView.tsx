'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import R2SHeader from '@/components/common/R2SHeader';
import { Button } from '@/components/ui/Button';
import SuccessAnimation from '@/components/settlement/SuccessAnimation';
import FinalDiscountCard from '@/components/settlement/FinalDiscountCard';
import PaymentDetailsCard from '@/components/settlement/PaymentDetailsCard';
import CampaignSummaryCard from '@/components/settlement/CampaignSummaryCard';
import ProductDeliveryInfo from '@/components/settlement/ProductDeliveryInfo';
import { getCampaignById } from '@/lib/mockData';
import { Campaign } from '@/types';
import { ROUTES } from '@/constants';

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
      <PageLayout>
        <R2SHeader showClose />
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
    <PageLayout containerBackground="white">
      <div className="flex flex-col min-h-screen">
        {/* 공통 R2S 헤더 */}
        <R2SHeader showClose />
        
        {/* 페이지 제목 */}
        <header className="bg-gradient-to-br from-[#1DB954] to-[#1AA34A] pt-[44px] pb-[16px]">
          <div className="flex items-center justify-center px-[20px] py-[8px]">
            <h1 className="text-white text-[18px] font-bold text-center">🎉 캠페인이 성공적으로 완료되었습니다!</h1>
          </div>
          {/* Success Animation */}
          <div className="px-[20px] py-[16px]">
            <SuccessAnimation />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-[20px] space-y-[16px] py-[20px] pb-[140px]">
          {/* Final Discount Card */}
          <div className="py-[8px]">
            <FinalDiscountCard 
              finalDiscountAmount={settlementData.discount.finalDiscountAmount}
              finalDiscount={settlementData.discount.finalDiscount}
              achievedRate={settlementData.discount.achievedRate}
              totalParticipants={settlementData.campaign.totalParticipants}
            />
          </div>

          {/* Payment Details */}
          <div className="py-[8px]">
            <PaymentDetailsCard 
              depositAmount={settlementData.payment.depositAmount}
              discountAmount={settlementData.payment.discountAmount}
              finalAmount={settlementData.payment.finalAmount}
              transactionId={settlementData.payment.transactionId}
              completedAt={settlementData.payment.completedAt}
            />
          </div>

          {/* Campaign Summary */}
          <div className="py-[8px]">
            <CampaignSummaryCard 
              totalParticipants={settlementData.campaign.totalParticipants}
              waitingTime={settlementData.campaign.waitingTime}
              successRate={settlementData.campaign.successRate}
            />
          </div>

          {/* Product Delivery Info */}
          <div className="py-[8px]">
            <ProductDeliveryInfo product={settlementData.product} />
          </div>
        </main>

        {/* Fixed Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-[20px] py-[16px] space-y-[12px]">
          {/* Action Buttons */}
          <div className="flex gap-[12px]">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleViewReceipt}
              className="flex-1 h-[48px]"
            >
              📋 영수증 보기
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleShare}
              className="flex-1 h-[48px]"
            >
              📤 친구에게 공유
            </Button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <button 
              onClick={handleViewNewCampaigns}
              className="text-[#388EDA] text-[12px] hover:underline"
            >
              🔥 새로운 캠페인을 확인해보세요!
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}