'use client';

import { Card } from '@/src/components/ui/Card';

interface WalletInfoCardProps {
  address: string;
  balance: number;
  connected: boolean;
}

export default function WalletInfoCard({ address, balance, connected }: WalletInfoCardProps) {
  return (
    <Card variant="outlined" className="h-full px-[20px] py-[12px]">
        <div className="flex justify-between items-center mb-[4px]">
          <span className="text-[#212529] text-[14px] font-bold">💳 USDT 지갑</span>
          {connected && (
            <span className="text-[#28A745] text-[12px] font-bold">✓ 연결됨</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#6C757D] text-[12px]">잔액: {balance.toFixed(2)} USDT</span>
          <span className="text-[#6C757D] text-[12px]">{address}</span>
        </div>
    </Card>
  );
}