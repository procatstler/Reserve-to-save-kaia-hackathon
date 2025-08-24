'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLayout from '@/src/components/layout/PageLayout';
import Button from '@/src/components/ui/Button';
import ProductSummaryCard from '@/src/components/payment/ProductSummaryCard';
import DepositAmountSection from '@/src/components/payment/DepositAmountSection';
import ExpectedDiscountSection from '@/src/components/payment/ExpectedDiscountSection';
import SafetyGuaranteeCard from '@/src/components/payment/SafetyGuaranteeCard';
import WarningSection from '@/src/components/payment/WarningSection';
import WalletInfoCard from '@/src/components/payment/WalletInfoCard';
import { getCampaignById } from '@/lib/mockData';
import { Campaign } from '@/src/types';
import { ROUTES } from '@/src/constants';

export default function PaymentConfirmationView() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || '1';
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const campaignData = getCampaignById(campaignId);
    if (campaignData) {
      setCampaign(campaignData);
    }
    setLoading(false);
  }, [campaignId]);

  if (loading || !campaign) {
    return (
      <PageLayout
        header={{
          title: '참여 확인',
          subtitle: 'STEP 2/3 • 예치금 확인 및 결제',
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

  const paymentData = {
    pricing: {
      originalPrice: campaign.originalPrice,
      depositAmount: campaign.originalPrice,
      currentDiscount: campaign.discountPercent,
      currentDiscountAmount: campaign.originalPrice - campaign.discountedPrice,
      additionalDiscount: 3,
      additionalDiscountAmount: 3.00,
      expectedFinalPrice: campaign.discountedPrice - 3
    },
    wallet: {
      address: '0x1234...abcd',
      balance: 1234.56,
      connected: true
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      router.push(`${ROUTES.myParticipation}?newParticipation=${campaignId}`);
    }, 2000);
  };

  return (
    <PageLayout
      header={{
        title: '참여 확인',
        subtitle: 'STEP 2/3 • 예치금 확인 및 결제',
        showBack: true,
        showClose: true,
        variant: 'gradient'
      }}
      containerBackground="white"
    >
      {/* Product Info - 11.70% from top */}
      <div className="absolute top-[11.70%] left-[5.33%] right-[5.33%] h-[8.62%]">
        <ProductSummaryCard campaign={campaign} />
      </div>
      
      {/* Deposit Amount - 22.41% from top */}
      <div className="absolute top-[22.41%] left-[5.33%] right-[5.33%] h-[16.75%]">
        <DepositAmountSection 
          originalPrice={paymentData.pricing.originalPrice}
          depositAmount={paymentData.pricing.depositAmount}
        />
      </div>
      
      {/* Expected Discount - 39.66% from top */}
      <div className="absolute top-[39.66%] left-[5.33%] right-[5.33%] h-[14.90%]">
        <ExpectedDiscountSection 
          currentDiscount={paymentData.pricing.currentDiscount}
          currentDiscountAmount={paymentData.pricing.currentDiscountAmount}
          additionalDiscountAmount={paymentData.pricing.additionalDiscountAmount}
          expectedFinalPrice={paymentData.pricing.expectedFinalPrice}
        />
      </div>
      
      {/* Safety Guarantee - 54.80% from top */}
      <div className="absolute top-[54.80%] left-[5.33%] right-[5.33%] h-[10.96%]">
        <SafetyGuaranteeCard />
      </div>
      
      {/* Warning Section - 67.73% from top */}
      <div className="absolute top-[67.73%] left-[5.33%] right-[5.33%] h-[10.59%]">
        <WarningSection />
      </div>
      
      {/* Wallet Info - 78.57% from top */}
      <div className="absolute top-[78.57%] left-[5.33%] right-[5.33%] h-[6.40%]">
        <WalletInfoCard 
          address={paymentData.wallet.address}
          balance={paymentData.wallet.balance}
          connected={paymentData.wallet.connected}
        />
      </div>

      {/* CTA Button - 86.21% from top */}
      <div className="absolute top-[86.21%] left-[5.33%] right-[5.33%] h-[5.91%]">
        <Button
          fullWidth
          size="xl"
          className="h-full"
          onClick={handleConfirmPayment}
          disabled={isProcessing}
        >
          {isProcessing ? '처리 중...' : `${paymentData.pricing.depositAmount} USDT 예치하고 참여하기`}
        </Button>
      </div>

      {/* Processing Message - 92.61% from top */}
      {isProcessing && (
        <div className="absolute top-[92.61%] left-[5.33%] right-[5.33%] h-[3.69%]">
          <div className="bg-[#F5F5F5] rounded-[8px] p-[8px] h-full flex items-center justify-center">
            <p className="text-[#6C757D] text-[14px] text-center">⏳ 블록체인에 거래를 전송하고 있습니다...</p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}